---
applyTo: "backend/src/ai/**,eval/**"
---

# AI and evaluation instructions

- Version prompts in `backend/src/ai/prompts/`.
- Ground rules answers in retrieved material and return page/section citations.
- Do not fabricate a source or answer when retrieval has insufficient evidence.
- Keep evaluation inputs and expected answers in version-controlled datasets;
  exclude secrets and personal data.
- Record evaluation methods and results in `docs/EVAL.md`.
