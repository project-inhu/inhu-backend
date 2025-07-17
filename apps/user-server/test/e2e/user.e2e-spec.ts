import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '@user/common/module/prisma/prisma.service';
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

    it('should return 500 if an unexpected error occurs', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const originalMethod = prisma.user.findUnique;
      prisma.user.findUnique = () => {
        throw new Error();
      };

      const res = await request(app.getHttpServer()).get('/user').expect(500);

      expect(res.body.statusCode).toBe(500);
      expect(res.body.message).toBe('Internal server error');

      prisma.user.findUnique = originalMethod;
    });
  });

  describe('PATCH /user', () => {
    it('should update only nickname when valid', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const res = await request(app.getHttpServer())
        .patch('/user')
        .send({ nickname: 'newNicknameOnly' })
        .expect(200);

      expect(res.body).toEqual({
        idx: user.idx,
        nickname: 'newNicknameOnly',
        profileImagePath: user.profileImagePath,
        createdAt: expect.any(String),
        deletedAt: null,
      });
    });

    it('should update only profileImagePath when valid', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const newProfile = 'user/new-profile.jpg';
      const res = await request(app.getHttpServer())
        .patch('/user')
        .send({ profileImagePath: newProfile })
        .expect(200);

      expect(res.body).toEqual({
        idx: user.idx,
        nickname: user.nickname,
        profileImagePath: newProfile,
        createdAt: expect.any(String),
        deletedAt: null,
      });
    });

    it('should return 400 when both nickname and profileImagePath are provided', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const res = await request(app.getHttpServer())
        .patch('/user')
        .send({
          nickname: 'invalidBoth',
          profileImagePath: 'user/invalid.jpg',
        })
        .expect(400);

      expect(res.body.message).toBe('Only one field can be updated at a time.');
    });

    it('should return 400 when neither nickname nor profileImagePath is provided', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const res = await request(app.getHttpServer())
        .patch('/user')
        .send({})
        .expect(400);

      expect(res.body.message).toBe('One field must be provided.');
    });

    it('should return 500 if an unexpected error occurs', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const originalFn = prisma.user.update;
      prisma.user.update = () => {
        throw new Error();
      };

      const res = await request(app.getHttpServer())
        .patch('/user')
        .send({ nickname: 'testError' })
        .expect(500);

      expect(res.body.statusCode).toBe(500);
      expect(res.body.message).toBe('Internal server error');

      prisma.user.update = originalFn;
    });
  });

  describe('DELETE /user', () => {
    it('should soft delete the user and set deletedAt', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      await request(app.getHttpServer()).delete('/user').expect(200);

      const deletedUser = await prisma.user.findUnique({
        where: { idx: user.idx },
      });

      expect(deletedUser).not.toBeNull();
      expect(deletedUser?.deletedAt).toBeInstanceOf(Date);

      await request(app.getHttpServer()).get('/user').expect(404);
    });

    it('should return 404 if user does not exist', async () => {
      testManager.setUserIdx(99999);

      await request(app.getHttpServer()).delete('/user').expect(404);
    });

    it('should return 500 if an unexpected error occurs', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const originalFn = prisma.user.update;
      prisma.user.update = () => {
        throw new Error();
      };

      const res = await request(app.getHttpServer())
        .delete('/user')
        .expect(500);

      expect(res.body.statusCode).toBe(500);
      expect(res.body.message).toBe('Internal server error');

      prisma.user.update = originalFn;
    });
  });

  describe('DELETE /user', () => {
    it('should soft delete the user and set deletedAt', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      await request(app.getHttpServer()).delete('/user').expect(200);

      const deletedUser = await prisma.user.findUnique({
        where: { idx: user.idx },
      });

      expect(deletedUser).not.toBeNull();
      expect(deletedUser?.deletedAt).toBeInstanceOf(Date);

      await request(app.getHttpServer()).get('/user').expect(404);
    });

    it('should return 404 if user does not exist', async () => {
      testManager.setUserIdx(99999);

      await request(app.getHttpServer()).delete('/user').expect(404);
    });

    it('should return 500 if an unexpected error occurs', async () => {
      const user = await new UserSeedHelper(prisma).seed();
      testManager.setUserIdx(user.idx);

      const originalFn = prisma.user.update;
      prisma.user.update = () => {
        throw new Error();
      };

      const res = await request(app.getHttpServer())
        .delete('/user')
        .expect(500);

      expect(res.body.statusCode).toBe(500);
      expect(res.body.message).toBe('Internal server error');

      prisma.user.update = originalFn;
    });
  });
});
