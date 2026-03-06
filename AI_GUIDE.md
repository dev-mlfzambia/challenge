# AI Assistance Guidelines (Cursor)

## Project context

- Tech stack: NestJS, TypeScript, TypeORM, PostgreSQL, Jest.
- Goal: Fix the 4 known issues (officeName, status filter, build failure, RBAC)
  with **small, focused changes**.

## Code style and scope

- Follow existing NestJS patterns:
  - Controllers handle HTTP.
  - Services contain business logic.
  - Repositories/TypeORM handle DB.
- Use TypeScript with clear types; avoid `any` unless already used.
- Keep diffs small. Do **one bug/feature per change**.
- Match existing naming, imports, folder structure.

## When fixing bugs

1. First, explain the root cause in 2–3 bullet points.
2. Then propose a **minimal change** that fixes only that bug.
3. Do NOT:
   - Refactor unrelated modules.
   - Add new libraries.
   - Add long, generic comments.

## Security and RBAC

- Never weaken existing auth/role checks.
- For protected endpoints:
  - Ensure proper guards (`AuthGuard`, `RolesGuard`, etc.).
  - Enforce roles via decorators or consistent checks.
- Validate incoming data (DTOs/pipes) before using it.

## Database and queries

- Use existing TypeORM entities and relations.
- Prefer query builder/repository methods already used in this codebase.
- Add conditions (e.g. status filters) in the **WHERE** clause only when a
  parameter is provided.
- Be careful with joins; only load what is needed (e.g. office for group).

## Testing

- Keep or fix existing Jest tests.
- When adding tests:
  - Focus on the specific bug (e.g. officeName presence, status filter).
  - Follow the current test style and folder structure.

## Response format for Cursor

When I ask for help:

1. Identify the problem and root cause briefly.
2. Show updated code snippets (only changed parts) in fenced code blocks.
3. Mention any test you recommend adding or updating.
4. Keep the answer short and practical.
