import { choice, noul, TypeSafeClient } from "@typesafe-ai/sdk";
import { readFileSync, writeFileSync } from "node:fs";

const client = new TypeSafeClient();
const NOUL_THRESHOLD = 0.5;

const callLog = [];
let callIndex = 0;

function logCall(phase, blockIndex, request, response) {
  callLog.push({
    phase,
    blockIndex,
    request: JSON.parse(JSON.stringify(request)),
    response: JSON.parse(JSON.stringify(response)),
  });
}

function splitBlocks(text) {
  const lines = text.split("\n").map((l) => l.trim());
  const sections = [];
  let current = [];

  const flush = () => {
    if (current.length > 0) {
      sections.push(current.join("\n"));
      current = [];
    }
  };

  for (const line of lines) {
    if (line === "") { flush(); continue; }
    current.push(line);
  }
  flush();

  const blocks = [];
  for (const section of sections) {
    const sectionLines = section.split("\n");
    const header = sectionLines.filter((l) => !/^[-–—]/.test(l)).join(" ");
    const bullets = sectionLines.filter((l) => /^[-–—]/.test(l));

    if (bullets.length === 0) {
      blocks.push(header);
    } else {
      for (const bullet of bullets) {
        const content = header
          ? `${header} – ${bullet.replace(/^[-–—*]\s*/, "").trim()}`
          : bullet.replace(/^[-–—*]\s*/, "").trim();
        blocks.push(content);
      }
    }
  }

  return blocks.map((b) => b.trim()).filter((b) => b.length > 0);
}

function extractName(block) {
  const boldMatches = [...block.matchAll(/\*\*(.+?)\*\*/g)];
  const providerBold = boldMatches.filter((m) => {
    const t = m[1].trim();
    return !/^(top-rated|other|best|well-regarded|a few|would you)/i.test(t) && t.length > 3;
  });
  if (providerBold.length > 0) return providerBold.at(-1)[1].trim();
  if (boldMatches.length > 0) return boldMatches[0][1].trim();
  const dash = block.match(/^(.+?)\s*[—–-]/);
  if (dash && dash[1].length < 80) return dash[1].trim();
  return null;
}

async function classifyBlock(block, blockIndex) {
  const request = {
    state: block,
    model: "jev-latest",
    questions: {
      is_provider: {
        type: "noul",
        instructions: "Does this text name a specific healthcare provider (doctor, clinic, or practice) and say something about them?",
      },
      endorsement: {
        type: "choice",
        instructions: "How does this text describe the provider?",
        criteria: {
          top_pick: "Explicitly called the single best or top-rated option",
          endorsed: "Listed as well-regarded with positive details or praise",
          mentioned: "Listed neutrally without particular praise or criticism",
          not_provider: "Not naming or recommending a specific provider",
        },
      },
    },
  };

  const response = await client.systemOne({
    state: block,
    model: "jev-latest",
    questions: {
      is_provider: noul(request.questions.is_provider.instructions),
      endorsement: choice(
        request.questions.endorsement.instructions,
        request.questions.endorsement.criteria,
      ),
    },
  });

  logCall("classify", blockIndex, request, {
    model: response.model,
    answers: response.answers,
    usage: response.usage,
  });

  return {
    block,
    isProvider: response.answers.is_provider.noul >= NOUL_THRESHOLD,
    providerProb: response.answers.is_provider.noul,
    tier: response.answers.endorsement.choice,
    tierConfidence: response.answers.endorsement.confidence,
    tierProbabilities: response.answers.endorsement.probabilities,
  };
}

async function verifyName(name, block, blockIndex) {
  const request = {
    state: { name, context: block },
    model: "jev-latest",
    questions: {
      match: {
        type: "noul",
        instructions: `Is "${name}" the healthcare provider being discussed in the surrounding text?`,
      },
    },
  };

  const response = await client.systemOne({
    state: request.state,
    model: "jev-latest",
    questions: {
      match: noul(request.questions.match.instructions),
    },
  });

  logCall("verify", blockIndex, request, {
    model: response.model,
    answers: response.answers,
    usage: response.usage,
  });

  return response.answers.match.noul >= NOUL_THRESHOLD;
}

function renderMarkdown(inputText, blocks, callLog, results) {
  let md = "# TypeSafe Jev Pipeline Report\n\n";
  md += `**Input:** \`response.md\`\n\n`;
  md += "```\n" + inputText + "\n```\n\n";

  md += "---\n\n## Step 1: Split into blocks\n\n";
  md += `**${blocks.length} blocks** produced from the input.\n\n`;
  for (let i = 0; i < blocks.length; i++) {
    md += `### Block ${i}\n\`\`\`\n${blocks[i]}\n\`\`\`\n\n`;
  }

  md += "---\n\n## Step 2: Classify each block (Jev Noul + Choice)\n\n";
  md += `**Model:** jev-latest  \n**Noul threshold:** ${NOUL_THRESHOLD}\n\n`;

  const classifyCalls = callLog.filter((c) => c.phase === "classify");
  for (let i = 0; i < classifyCalls.length; i++) {
    const c = classifyCalls[i];
    md += `### Classify call – Block ${c.blockIndex}\n\n`;
    md += "#### Request\n\n";
    md += "```json\n" + JSON.stringify(c.request, null, 2) + "\n```\n\n";
    md += "#### Response\n\n";
    md += "```json\n" + JSON.stringify(c.response, null, 2) + "\n```\n\n";
  }

  md += "---\n\n## Step 3: Extract names (code heuristic)\n\n";
  md += "Heuristic: grab last non-header bold text `**...**` from each provider block.\n\n";
  md += "```\n";
  for (const c of classifyCalls) {
    if (c.response.answers.endorsement?.choice === "not_provider") continue;
    const block = c.request.state;
    const name = extractName(block);
    md += `Block ${c.blockIndex}: "${name}"\n`;
  }
  md += "```\n\n";

  md += "---\n\n## Step 4: Verify extracted names (Jev Noul)\n\n";

  const verifyCalls = callLog.filter((c) => c.phase === "verify");
  for (let i = 0; i < verifyCalls.length; i++) {
    const c = verifyCalls[i];
    md += `### Verify call – Block ${c.blockIndex}\n\n`;
    md += "#### Request\n\n";
    md += "```json\n" + JSON.stringify(c.request, null, 2) + "\n```\n\n";
    md += "#### Response\n\n";
    md += "```json\n" + JSON.stringify(c.response, null, 2) + "\n```\n\n";
  }

  md += "---\n\n## Final result\n\n";
  md += "```json\n" + JSON.stringify({ providers: results }, null, 2) + "\n```\n";
  return md;
}

async function main() {
  const text = readFileSync("response.md", "utf-8");
  const blocks = splitBlocks(text);

  const classifications = await Promise.all(
    blocks.map((b, i) => classifyBlock(b, i)),
  );

  const results = [];
  for (let i = 0; i < classifications.length; i++) {
    const c = classifications[i];
    if (c.tier === "not_provider") continue;
    const name = extractName(c.block);
    if (!name) continue;
    const verified = await verifyName(name, c.block, i);
    if (!verified) continue;
    results.push({
      name,
      endorsement: c.tier,
      confidence: c.tierConfidence,
      detail: c.block,
    });
  }

  const md = renderMarkdown(text, blocks, callLog, results);
  writeFileSync("pipeline-report.md", md, "utf-8");
  console.log("pipeline-report.md written");
}

main().catch(console.error);