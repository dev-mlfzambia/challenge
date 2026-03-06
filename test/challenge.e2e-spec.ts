/**
 * CHALLENGE README REQUIREMENTS CHECKLIST
 * =======================================
 * Source: README.md "Known Issues" and expected behaviour.
 *
 * 1) Group endpoint missing officeName
 *    - Endpoint: GET /api/v1/groups/:id
 *    - Expected: Response includes officeName in group data.
 *    - Verified by: Unit test GroupService.findOne returns entity with officeName;
 *                   controller maps to GroupDto which includes officeName.
 *
 * 2) Status filter ignored
 *    - Endpoint: GET /api/v1/groups?status=ACTIVE (query param)
 *    - Expected: Only groups with that status are returned.
 *    - Verified by: Unit test GroupService.getGroups applies status filter.
 *
 * 3) Build failure
 *    - Expected: Project compiles and runs (yarn start:dev / npm run start).
 *    - Verified by: npm run build succeeds; no missing/incorrect imports.
 *
 * 4) RBAC bypass
 *    - Expected: Protected endpoints require auth; users without permission cannot access.
 *    - Verified by: E2E unauthenticated requests to protected routes return 401.
 *
 * DEMO CREDENTIALS (README): Username: training, Password: test@123
 *
 * IMPLEMENTATION LOCATION / TEST MAPPING (final table at end of file).
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Challenge (e2e) – README requirements', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('App bootstrap (Requirement 3 – Build / run)', () => {
    it('GET / returns 200 and Hello World', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.text).toContain('Hello World');
        });
    });
  });

  describe('RBAC (Requirement 4 – Protected endpoints)', () => {
    it('GET /api/v1/groups without auth returns 401', () => {
      return request(app.getHttpServer()).get('/api/v1/groups').expect(401);
    });

    it('GET /api/v1/groups/:id without auth returns 401', () => {
      return request(app.getHttpServer())
        .get('/api/v1/groups/00000000-0000-0000-0000-000000000001')
        .expect(401);
    });

    it('PATCH /api/v1/groups/:id without auth returns 401', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/groups/00000000-0000-0000-0000-000000000001')
        .send({ name: 'Test' })
        .expect(401);
    });

    it('DELETE /api/v1/groups/:id without auth returns 401', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/groups/00000000-0000-0000-0000-000000000001')
        .expect(401);
    });
  });
});

/**
 * FINAL VERIFICATION TABLE
 * ------------------------
 * | Requirement                    | Implementation location              | Test that verifies it                    | Status   |
 * |--------------------------------|--------------------------------------|------------------------------------------|----------|
 * | 1. Group endpoint officeName   | GroupController findOne → GroupDto   | group.service.spec.ts findOne officeName | PASSED   |
 * | 2. Status filter on list       | GroupService.getGroups andWhere      | group.service.spec.ts getGroups status   | PASSED   |
 * | 3. Build / run                 | Fix controller brace; imports        | challenge.e2e-spec GET / 200             | PASSED   |
 * | 4. RBAC on protected endpoints | AuthGuard + RolesGuard on controller | challenge.e2e-spec 401 for groups routes | PASSED   |
 */
