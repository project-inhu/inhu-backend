import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { TestManager } from '../common/helpers/test-manager';
import { UserSeedHelper } from '../common/seed/user-seed.helper';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = TestManager.create();
    await testManager.init();
    app = testManager.getApp();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await testManager.startTransaction();
  });

  afterEach(async () => {
    await testManager.rollbackTransaction();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('GET /user', () => {
    it('should return user info when user is authenticated', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const res = await request(app.getHttpServer()).get('/user').expect(200);

      expect(res.body).toEqual({
        idx: user.idx,
        nickname: user.nickname,
        profileImagePath: user.profileImagePath,
        createdAt: expect.any(String),
        deletedAt: null,
      });
    });

    it('should return 404 if user does not exist', async () => {
      testManager.setUserIdx(99999);
      const res = await request(app.getHttpServer()).get('/user').expect(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return 500 if internal server error occurs', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const originalMethod = prisma.user.findUnique;
      prisma.user.findUnique = () => {
        throw new Error('Unexpected error');
      };

      const res = await request(app.getHttpServer()).get('/user').expect(500);
      expect(res.body.message).toBe('Internal server error');

      prisma.user.findUnique = originalMethod;
    });
  });
});
