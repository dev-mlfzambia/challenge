Use the rules in AI_GUIDE.md.

Goal:
1) Verify that EVERY task and requirement in the challenge README
   works exactly as specified.
2) Refactor and improve the code where it clearly benefits readability,
   maintainability, or performance, but WITHOUT drifting away from
   the project’s existing patterns and conventions.

Context:
- Project: NestJS + TypeORM + PostgreSQL backend (core_banking DB).
- DB config issues have been fixed; the app connects to Postgres using
  the correct credentials and the core_banking database has all tables.
- There is a README with challenge tasks, expected behavior, and
  acceptance criteria (endpoints, validation, responses, etc.).
- Existing code already follows some conventions (modules, DTOs,
  services, guards, interceptors, etc.). Stick to these patterns.

Tasks:

1. Extract and formalize requirements:
   - Read the main README (and any referenced docs) in this repo.
   - Build a precise checklist of ALL requirements:
     - Endpoints (routes + methods).
     - Request payloads and query params.
     - Expected status codes and response formats.
     - Business rules, validations, and special cases.
   - Add this checklist as a comment block at the top of a central test
     file (e.g. test/challenge.e2e-spec.ts or similar).

2. Map requirements to tests:
   - For each checklist item, ensure there is a concrete test:
     - Prefer e2e tests for full flows and contract checks.
     - Use unit tests for complex business logic in services/helpers.
   - If a requirement is not covered, add a new test:
     - Use Nest’s testing module and SuperTest for e2e tests.
     - Derive sample payloads/assertions directly from the README’s
       examples and rules.

3. Fix behavior to match README:
   - Run npm run test and npm run test:e2e (or the equivalent scripts).
   - For any failing or missing behavior:
     - Update controllers/services/entities/DTOs to align EXACTLY with
       the README, keeping route names and API shapes consistent with
       the project.
     - Match status codes, error messages (where specified), and edge
       case handling.
   - Keep changes focused: don’t introduce new features beyond README
     scope unless required for correctness.

4. Senior-level refactor (without breaking style):
   - After tests pass (or while tightening them), refactor where it
     clearly improves quality:
     - Extract duplicated logic into private methods or shared helpers.
     - Simplify overly complex methods, reduce nesting, and clarify
       control flow.
     - Improve typing (DTOs, response types, generics) and validation
       usage.
     - Normalize error handling and logging to consistent patterns
       already used in the project.
   - Respect existing architecture:
     - Do NOT change module boundaries, naming conventions, or folder
       structure unless it is obviously inconsistent and low-risk.
     - Follow current coding style (decorators, DI patterns, interceptors,
       guards) instead of inventing a new architecture.

5. Final verification and documentation:
   - Re-run:
     - npm run lint
     - npm run test
     - npm run test:e2e (if present)
   - Ensure:
     - All tests relevant to the README checklist pass.
     - No new lint errors are introduced (warnings are OK if they match
       project norms).
   - In the main challenge test file or a short markdown note, produce a
     final table/checklist:

       - Requirement (from README)
       - Implementation location (module/service/controller)
       - Test that verifies it (file + test name)
       - Status: PASSED / PARTIAL / MISSING

   - Briefly comment (PR-style notes) on:
     - The most important refactors made.
     - How the new/updated tests prove that the README tasks work
       exactly as expected.

Constraints:
- Do not add new major dependencies.
- Do not change external API contracts without an explicit requirement
  from the README.
- Prioritize correctness and clear tests first, then focused refactors.
- Keep all changes aligned with the existing project style and standards.