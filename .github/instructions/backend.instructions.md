---
applyTo: "backend/**"
---

# Backend instructions

- Use TypeScript and follow the existing route/controller/service/repository
  separation.
- Validate external input and return consistent errors.
- Keep database queries parameterized and migrations reversible where practical.
- Never expose provider API keys or internal errors to clients.
- Keep endpoints aligned with `docs/openapi.yaml` and add focused tests.
