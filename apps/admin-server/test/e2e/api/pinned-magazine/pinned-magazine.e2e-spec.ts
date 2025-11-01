import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { MagazineSeedHelper } from '@libs/testing/seed/magazine/magazine.seed';
import { PinnedMagazineSeedHelper } from '@libs/testing/seed/pinned-magazine/pinned-magazine.seed';

describe('Pinned Magazine e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const magazineSeedHelper = testHelper.seedHelper(MagazineSeedHelper);
  const pinnedMagazineSeedHelper = testHelper.seedHelper(
    PinnedMagazineSeedHelper,
  );

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /magazine/:idx/pin', () => {
    it('200 - successfully pin magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/pin`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ pinned: true })
        .expect(200);

      const updatedMagazine = await testHelper
        .getPrisma()
        .pinnedMagazine.findUniqueOrThrow({ where: { idx: magazineSeed.idx } });

      expect(updatedMagazine.idx).toBe(magazineSeed.idx);
    });

    it('200 - successfully unpin magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      await pinnedMagazineSeedHelper.seed({ idx: magazineSeed.idx });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/pin`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ pinned: false })
        .expect(200);

      const updatedMagazine = await testHelper
        .getPrisma()
        .pinnedMagazine.findFirst({ where: { idx: magazineSeed.idx } });

      expect(updatedMagazine).toBeNull();
    });

    it('400 - invalid magazine idx(pin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidMagazineIdx = 'invalid-magazine-idx';

      await testHelper
        .test()
        .post(`/magazine/${invalidMagazineIdx}/pin`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ pinned: true })
        .expect(400);
    });

    it('404 - magazine not found(unpin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentMagazineIdx = 9999999;

      await testHelper
        .test()
        .post(`/magazine/${nonExistentMagazineIdx}/pin`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ pinned: false })
        .expect(404);
    });

    it('409 - magazine is already pinned', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      await pinnedMagazineSeedHelper.seed({ idx: magazineSeed.idx });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/pin`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ pinned: true })
        .expect(409);
    });

    it('409 - magazine is not pinned', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/pin`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ pinned: false })
        .expect(409);
    });
  });
});
