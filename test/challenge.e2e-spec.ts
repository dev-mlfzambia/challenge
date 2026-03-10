/**
 * CHALLENGE README REQUIREMENTS CHECKLIST (guide.md Task 1)
 * =========================================================
 * Source: README.md "Known Issues" and expected behaviour.
 *
 * 1) Group endpoint missing officeName
 *    - Endpoint: GET /api/v1/groups/:id
 *    - Request: Authenticated GET with group id.
 *    - Expected: 200, response includes officeName in group data.
 *    - Implementation: GroupService.findOne selects group.officeName; GroupDto maps it.
 *
 * 2) Status filter ignored
 *    - Endpoint: GET /api/v1/groups?status=ACTIVE (query param)
 *    - Expected: Only groups with that status are returned.
 *    - Implementation: GroupService.getGroups andWhere LOWER(status.name) = LOWER(:status).
 *
 * 3) Build failure
 *    - Expected: Project compiles and runs (yarn start:dev / npm run start:dev).
 *    - Implementation: Circular dependency (Client/Group) fixed; cross-env for NODE_ENV on Windows.
 *
 * 4) RBAC bypass
 *    - Expected: Protected endpoints require auth; unauthenticated requests get 401.
 *    - Implementation: GroupController @UseGuards(AuthGuard(), RolesGuard); E2E asserts 401.
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
 * FINAL VERIFICATION TABLE (guide.md Task 5)
 * ------------------------------------------
 * | Requirement                    | Implementation location                    | Test that verifies it                    | Status   |
 * |--------------------------------|--------------------------------------------|------------------------------------------|----------|
 * | 1. Group endpoint officeName   | GroupService.findOne (group.officeName);   | group.service.spec.ts findOne officeName | PASSED   |
 * |                                | GroupController findOne → GroupDto         |                                          |          |
 * | 2. Status filter on list       | GroupService.getGroups filters.status      | group.service.spec.ts getGroups status    | PASSED   |
 * |                                | andWhere LOWER(status.name)=LOWER(:status)  |                                          |          |
 * | 3. Build / run                 | Circular dep (group entity); cross-env      | challenge.e2e-spec GET / 200; npm run build | PASSED |
 * | 4. RBAC on protected endpoints | GroupController @UseGuards(AuthGuard,      | challenge.e2e-spec 401 for groups routes | PASSED   |
 * |                                | RolesGuard)                                |                                          |          |
 */
