---
name: review-pr
description: "Review a pull request against repository guidance, scoped instructions, the product specification, and the OpenAPI contract; report only actionable issues with severity and precise corrections."
argument-hint: "Specify the pull request or proposed change to review"
user-invocable: true
disable-model-invocation: true
---

# Review a pull request

Review the proposed change against `AGENTS.md`, the applicable scoped
instructions, `docs/SPEC.md`, and `docs/openapi.yaml`.

Report only actionable issues, ordered by severity. For each issue, include the
file and line, the failure scenario, and a concise suggested correction. If no
actionable issues are found, say so and mention any validation gaps.
