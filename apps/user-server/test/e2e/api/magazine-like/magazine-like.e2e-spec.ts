import { MagazineLikeSeedHelper } from '@libs/testing/seed/magazine-like/magazine-like.seed';
import { MagazineSeedHelper } from '@libs/testing/seed/magazine/magazine.seed';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Menu Like E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const magazineSeedHelper = testHelper.seedHelper(MagazineSeedHelper);
  const magazineLikeSeedHelper = testHelper.seedHelper(MagazineLikeSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /magazine/:idx/like', () => {
    it('200 - successfully like magazine', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const magazine = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });

      expect(magazine?.likeCount).toBe(1);
    });

    it('400 - invalid magazine idx', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post(`/magazine/invalid-idx/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(400);
    });

    it('404 - magazine not found', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post(`/magazine/9999999/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(404);
    });

    it('409 - magazine like already exists(not at the same time)', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      const prisma = testHelper.getPrisma();
      const magazineBefore = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });
      expect(magazineBefore?.likeCount).toBe(0);

      // First like
      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      // Second like attempt
      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(409);

      const magazineAfter = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });
      expect(magazineAfter?.likeCount).toBe(1);
    });

    it('409 - magazine like already exists(at the same time)', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      const prisma = testHelper.getPrisma();
      const magazineBefore = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });
      expect(magazineBefore?.likeCount).toBe(0);

      // Simulate concurrent like attempts
      await Promise.all([
        testHelper
          .test()
          .post(`/magazine/${magazineSeed.idx}/like`)
          .set('Authorization', `Bearer ${loginUser.app.accessToken}`),
        testHelper
          .test()
          .post(`/magazine/${magazineSeed.idx}/like`)
          .set('Authorization', `Bearer ${loginUser.app.accessToken}`),
      ]).then((responses) => {
        const statusCodes = responses.map((res) => res.status);
        expect(statusCodes).toContain(200);
        expect(statusCodes).toContain(409);
      });

      const magazineAfter = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });
      expect(magazineAfter?.likeCount).toBe(1);
    });
  });

  describe('DELETE /magazine/:idx/like', () => {
    it('200 - successfully unlike magazine', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      await magazineLikeSeedHelper.seed({
        magazineIdx: magazineSeed.idx,
        userIdx: loginUser.idx,
      });

      const prisma = testHelper.getPrisma();

      const magazineBefore = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });
      expect(magazineBefore?.likeCount).toBe(1);

      await testHelper
        .test()
        .delete(`/magazine/${magazineSeed.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const magazineAfter = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });

      expect(magazineAfter?.likeCount).toBe(0);
    });

    it('200 - unlike magazine when likeCount is 0 (no effect)', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
        likeCount: 0,
      });

      await testHelper
        .test()
        .delete(`/magazine/${magazineSeed.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const magazine = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });

      expect(magazine?.likeCount).toBe(0);
    });

    it('400 - invalid magazine idx', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .delete(`/magazine/invalid-idx/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(400);
    });

    it('404 - magazine not found', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .delete(`/magazine/9999999/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(404);
    });

    it('409 - magazine like does not exist(not at the same time)', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        likeCount: 1,
        activatedAt: new Date(),
        deletedAt: null,
      });

      await magazineLikeSeedHelper.seed({
        magazineIdx: magazineSeed.idx,
        userIdx: loginUser.idx,
      });

      const prisma = testHelper.getPrisma();
      const magazineBefore = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });
      expect(magazineBefore?.likeCount).toBe(2);

      await testHelper
        .test()
        .delete(`/magazine/${magazineSeed.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      await testHelper
        .test()
        .delete(`/magazine/${magazineSeed.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(409);

      const magazineAfter = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });
      expect(magazineAfter?.likeCount).toBe(1);
    });

    it('409 - magazine like does not exist(at the same time)', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        likeCount: 1,
        activatedAt: new Date(),
        deletedAt: null,
      });

      await magazineLikeSeedHelper.seed({
        magazineIdx: magazineSeed.idx,
        userIdx: loginUser.idx,
      });

      const prisma = testHelper.getPrisma();
      const magazineBefore = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });
      expect(magazineBefore?.likeCount).toBe(2);

      // Simulate concurrent unlike attempts
      await Promise.all([
        testHelper
          .test()
          .delete(`/magazine/${magazineSeed.idx}/like`)
          .set('Authorization', `Bearer ${loginUser.app.accessToken}`),
        testHelper
          .test()
          .delete(`/magazine/${magazineSeed.idx}/like`)
          .set('Authorization', `Bearer ${loginUser.app.accessToken}`),
      ]).then((responses) => {
        const statusCodes = responses.map((res) => res.status);
        expect(statusCodes).toContain(200);
        expect(statusCodes).toContain(409);
      });

      const magazineAfter = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });
      expect(magazineAfter?.likeCount).toBe(1);
    });
  });
});
