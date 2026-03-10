# Verification Summary (README + guide.md)

This document confirms that the project meets all README "Known Issues" requirements and follows the guide.md blueprint.

## README Requirements – Status

| # | Requirement | Implementation | Test | Status |
|---|-------------|----------------|------|--------|
| 1 | **Group endpoint includes `officeName`** | `GroupService.findOne()` selects `group.officeName`; `GroupController` GET `:id` returns `GroupDto(group)` which maps `officeName`. | `group.service.spec.ts` → "returns group with officeName in the result" | **PASSED** |
| 2 | **Status filter applied on GET groups** | `GroupService.getGroups()` applies `andWhere('LOWER(status.name) = LOWER(:status)', { status: filters.status.trim() })` when `filters.status` is provided. | `group.service.spec.ts` → "applies status filter when filters.status is provided" | **PASSED** |
| 3 | **Build and run successfully** | Circular dependency (ClientEntity ↔ GroupEntity) fixed via type-only import + string relation targets in `group.entity.ts`. `NODE_ENV` on Windows fixed via `cross-env` in npm scripts. | `npm run build`; `challenge.e2e-spec.ts` → "GET / returns 200 and Hello World" | **PASSED** |
| 4 | **RBAC: protected endpoints return 401 without auth** | `GroupController` uses `@UseGuards(AuthGuard(), RolesGuard)`; unauthenticated requests get 401. | `challenge.e2e-spec.ts` → GET/PATCH/DELETE `/api/v1/groups` and `:id` without auth return 401 | **PASSED** |

## guide.md Alignment

- **Task 1 (Requirements checklist):** Implemented in `test/challenge.e2e-spec.ts` header comment and in this table.
- **Task 2 (Requirements → tests):** Each README item has a unit or e2e test (see above).
- **Task 3 (Behavior vs README):** Group `officeName` and status filter implemented; build and RBAC verified by tests.
- **Task 4 (Refactor):** No structural or style drift; existing patterns (DTOs, guards, services) kept.
- **Task 5 (Final verification):** `npm run lint` (0 errors), `npm run build`, group unit tests, and challenge e2e tests all pass.

## Commands Run

- `npm run lint` → **0 errors** (warnings only; acceptable per guide).
- `npm run build` → **success**.
- `npx jest src/modules/group/group.service.spec.ts` → **5 tests passed**.
- `npx jest --config test/jest-e2e.json --testPathPattern="challenge.e2e"` → **5 tests passed**.

## Demo Credentials (README)

- **Username:** training  
- **Password:** test@123  

## Notes

- Database setup follows README: PostgreSQL + `core_banking.sql`. Optional `npm run db:load-schema` uses project `.env` and works when `psql` is not on PATH (Windows).
- Development: `npm run start:dev` or `yarn start:dev` (cross-env ensures `NODE_ENV=development` on Windows).
