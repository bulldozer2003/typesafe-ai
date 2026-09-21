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