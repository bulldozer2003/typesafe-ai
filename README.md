# TypeSafe Jev Pipeline

Extract provider names and endorsement tiers from LLM-generated text responses using [TypeSafe AI](https://typesafe.ai)'s System One model **Jev**.

## How it works

```
LLM response → split into blocks → Jev classifies each block →
extract names → Jev verifies each name → structured output
```

| Step | Tool | What it does |
|------|------|-------------|
| 1 | Code | Split text into paragraph/bullet blocks |
| 2 | **Jev** | Noul: "Is this a provider?" Choice: "What endorsement tier?" |
| 3 | Code | Extract provider name from bold markdown |
| 4 | **Jev** | Noul: "Does this name match the block?" |
| 5 | Code | Assemble results |

Jev handles **4 of 5 steps** — only string extraction stays in code (Jev can't generate arbitrary text).

## Design decisions

**Why not use Jev for everything?** Jev selects from options you define; it can't generate or extract arbitrary strings from free text. So name extraction uses a heuristic (grab the last bold-markdown span per block), and Jev verifies the result via a Noul question. This keeps Jev doing what it's best at — semantic classification and verification — while code handles the mechanical string operation.

**Why one Jev call per block instead of one call for everything?** Each block has different content, so running all questions in parallel (one call per block) avoids a single large state that could confuse the model. The calls are concurrent via `Promise.all`.

**Why ask Noul and Choice in the same call?** The Noul ("is this a provider?") and Choice ("what endorsement tier?") share the same state (the block text). Asking them together saves a round trip without sacrificing independence — Jev's parallel questions can't see each other's answers.

**Why verify names with a separate Jev call instead of using the same Choice call?** The name is extracted *after* the Choice is made (since code determines the string). Verification is a second question over different state — the extracted name paired with the original block text.

**Why `not_provider` as a Choice option instead of just thresholding the Noul?** Both checks gate on provider blocks — the Choice catches cases where the Noul probability is above threshold but the text doesn't actually name a provider (e.g., a paragraph about "finding a dermatologist" without naming one). The Noul threshold (0.5) is deliberately permissive; the Choice does the final filter.

## Limitations

- **Jev can't extract strings.** The pipeline relies on bold-markdown `**...**` heuristics for name extraction. Plain-text responses with no bold formatting would miss, requiring a chat LLM fallback.
- **Block splitting is format-sensitive.** The splitter assumes double-newline paragraph breaks and dash-prefixed bullet lists. A response that uses numbered lists, HTML, or inline formatting without blank lines may produce poorly-scoped blocks.
- **Endorsement tiers are coarse.** "Endorsed" covers everything from "strongly recommended" to "positively mentioned" — the three-tier system (top_pick / endorsed / mentioned) collapses nuanced gradations. A Score question with 5+ levels would give finer distinction but was omitted for simplicity in this experiment.
- **No caching.** Every run re-queries Jev for every block. For repeated evaluations of the same text, the classify calls are deterministic (same state + same questions → same answer) and could be cached.
- **Token cost scales with blocks.** 7 blocks = 7 classify calls + 4 verify calls = 11 Jev calls. Each classify call costs ~450 input tokens. A document with 50 blocks would cost proportionally more.

## Quick start

```bash
npm install
TYPESAFE_API_KEY=$(grep API_KEY .env | cut -d= -f2) node pipeline.mjs
```

Output: `pipeline-report.md` with full request/response traces.

## Files

| File | Purpose |
|------|---------|
| `pipeline.mjs` | Pipeline script |
| `response.md` | Sample LLM response (dermatology recommendations) |
| `pipeline-report.md` | Generated report with full Jev call traces |