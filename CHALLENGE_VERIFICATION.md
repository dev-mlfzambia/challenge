# Challenge README Verification

## Final checklist (README requirements → implementation → tests)

| Requirement | Implementation location | Test that verifies it | Status |
|-------------|-------------------------|------------------------|--------|
| 1. Group endpoint returns `officeName` | `GroupController.findOne` → `GroupDto(group)`; `GroupService.findOne` selects `group.officeName` | `group.service.spec.ts` → `findOne (README: group endpoint must include officeName)` → "returns group with officeName in the result" | PASSED |
| 2. Status filter applied on list groups | `GroupService.getGroups` → `queryBuilder.andWhere('LOWER(status.name) = LOWER(:status)', …)` when `filters.status` is set | `group.service.spec.ts` → `getGroups (README: status filter must be applied)` → "applies status filter when filters.status is provided" | PASSED |
| 3. Build / run succeeds | Controller class brace fixed; `AppService` import in `app.controller.ts`; no missing imports | `challenge.e2e-spec.ts` → "GET / returns 200 and Hello World"; `npm run build` | PASSED |
| 4. RBAC: protected endpoints enforce auth | `@UseGuards(AuthGuard(), RolesGuard)` on `GroupController`; no stray `}` closing class early | `challenge.e2e-spec.ts` → "GET/PATCH/DELETE /api/v1/groups(/:id) without auth returns 401" | PASSED |

## How to re-run verification

- **Lint:** `npm run lint` (warnings acceptable; no new errors).
- **Unit tests:** `npm run test` (group.service.spec and group.controller.spec cover README items 1 and 2).
- **E2E tests:** `npm run test:e2e` (challenge.e2e-spec covers app bootstrap and RBAC 401s).
- **Build:** `npm run build` (must succeed).

## Refactors and test strategy

- **Requirements extraction:** The README “Known Issues” list the only four required fixes. No extra API contracts or status-code rules were added; the checklist is limited to those four.
- **Tests added:**
  - **Unit:** `GroupService` specs now mock repositories and assert (1) `findOne` result includes `officeName`, (2) `getGroups` calls `andWhere` with the status condition when `filters.status` is provided.
  - **E2E:** `test/challenge.e2e-spec.ts` boots the full app and asserts unauthenticated requests to group routes return 401, and GET / returns 200 with “Hello World”.
- **Refactors:** Removed debug `console.log` in `GroupService.getGroupsByCenter`; fixed `GroupController` spec by providing mocked deps for `GroupService` so the controller test compiles and runs.
- **E2E setup:** Added `test/setup-e2e.ts` (NODE_ENV=development for config), `test/mocks/axios.ts` (mock for Jest ESM), and `moduleNameMapper` / `setupFiles` in `test/jest-e2e.json` so e2e runs without transforming axios in node_modules.

The new and updated tests demonstrate that the four README tasks (officeName, status filter, build, RBAC) are implemented and behave as specified.
