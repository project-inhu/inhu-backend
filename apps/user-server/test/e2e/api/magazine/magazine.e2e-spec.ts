import { BookmarkSeedHelper } from '@libs/testing/seed/bookmark/bookmark.seed';
import { MagazineLikeSeedHelper } from '@libs/testing/seed/magazine-like/magazine-like.seed';
import { MagazineSeedHelper } from '@libs/testing/seed/magazine/magazine.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { MagazineOverviewEntity } from '@user/api/magazine/entity/magazine-overview.entity';
import { MagazineEntity } from '@user/api/magazine/entity/magazine.entity';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Menu E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const bookmarkSeedHelper = testHelper.seedHelper(BookmarkSeedHelper);
  const magazineSeedHelper = testHelper.seedHelper(MagazineSeedHelper);
  const magazineLikeSeedHelper = testHelper.seedHelper(MagazineLikeSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /magazine/:idx', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const placeSeed = await placeSeedHelper.seed({
        name: 'Test Place',
        tel: '010-1234-5678',
        roadAddress: {
          name: 'Test Road Address',
          detail: 'Test Detail Address',
          addressX: 37.123456,
          addressY: 127.123456,
        },
        deletedAt: null,
        activatedAt: new Date(),
      });
      const bookmarkSeed = await bookmarkSeedHelper.seed({
        placeIdx: placeSeed.idx,
        userIdx: loginUser.idx,
      });
      const magazineSeed = await magazineSeedHelper.seed({
        title: 'Test Magazine',
        description: 'Test Description',
        content: 'Test Content',
        thumbnailPath: '/test-image.png',
        isTitleVisible: true,
        activatedAt: new Date(),
        deletedAt: null,
        placeIdxList: [placeSeed.idx],
      });
      await magazineLikeSeedHelper.seed({
        magazineIdx: magazineSeed.idx,
        userIdx: loginUser.idx,
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const magazine: MagazineEntity = response.body;

      expect(magazine.idx).toBe(magazineSeed.idx);
      expect(magazine.title).toBe(magazineSeed.title);
      expect(magazine.description).toBe(magazineSeed.description);
      expect(magazine.content).toBe(magazineSeed.content);
      expect(magazine.thumbnailImagePath).toBe(magazineSeed.thumbnailPath);
      expect(magazine.isTitleVisible).toBe(magazineSeed.isTitleVisible);
      expect(magazine.likeCount).toBe(1);
      expect(magazine.viewCount).toBe(1);
      expect(Array.isArray(magazine.placeList)).toBe(true);
      expect(magazine.placeList.length).toBe(1);
      expect(magazine.placeList[0].idx).toBe(placeSeed.idx);
      expect(magazine.placeList[0].name).toBe(placeSeed.name);
      expect(magazine.placeList[0].tel).toBe(placeSeed.tel);
      expect(magazine.placeList[0].roadAddress).toEqual({
        name: placeSeed.roadAddress.name,
        detail: placeSeed.roadAddress.detail,
        addressX: placeSeed.roadAddress.addressX,
        addressY: placeSeed.roadAddress.addressY,
      });
      expect(magazine.placeList[0].imagePathList).toEqual(
        placeSeed.placeImgList,
      );
      expect(magazine.placeList[0].bookmark).toBe(true);
      expect(magazine.isLiked).toBe(true);
    });

    it('200 - bookmark check when not bookmarked', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const [place1, place2] = await placeSeedHelper.seedAll([
        { deletedAt: null, activatedAt: new Date() },
        { deletedAt: null, activatedAt: new Date() },
      ]);
      const bookmark1 = await bookmarkSeedHelper.seed({
        placeIdx: place1.idx,
        userIdx: loginUser.idx,
      });
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
        placeIdxList: [place1.idx, place2.idx],
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const magazine: MagazineEntity = response.body;

      expect(magazine.placeList[0].bookmark).toBe(true);
      expect(magazine.placeList[1].bookmark).toBe(false);
    });

    it('200 - bookmark check when not login', async () => {
      const [place1, place2] = await placeSeedHelper.seedAll([
        { deletedAt: null, activatedAt: new Date() },
        { deletedAt: null, activatedAt: new Date() },
      ]);
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
        placeIdxList: [place1.idx, place2.idx],
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .expect(200);

      const magazine: MagazineEntity = response.body;

      expect(magazine.placeList[0].bookmark).toBe(false);
      expect(magazine.placeList[1].bookmark).toBe(false);
    });

    it('200 - isLiked check when not liked', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const magazine: MagazineEntity = response.body;

      expect(magazine.isLiked).toBe(false);
    });

    it('200 - isLiked check when not login', async () => {
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .expect(200);

      const magazine: MagazineEntity = response.body;

      expect(magazine.isLiked).toBe(false);
    });

    it('200 - viewCount increment check(multiple calls && not login)', async () => {
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      const callCount = 5;
      for (let i = 0; i < callCount; i++) {
        await testHelper
          .test()
          .get(`/magazine/${magazineSeed.idx}`)
          .expect(200);
      }

      const prisma = testHelper.getPrisma();
      const magazineAfter = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });

      expect(magazineAfter?.viewCount).toBe(callCount);
    });

    it('200 - viewCount increment check(multiple calls && login)', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      const callCount = 5;
      for (let i = 0; i < callCount; i++) {
        await testHelper
          .test()
          .get(`/magazine/${magazineSeed.idx}`)
          .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
          .expect(200);
      }

      const prisma = testHelper.getPrisma();
      const magazineAfter = await prisma.magazine.findUnique({
        where: { idx: magazineSeed.idx },
      });

      expect(magazineAfter?.viewCount).toBe(callCount);
    });

    it('404 - magazine not exists', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get(`/magazine/999999`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(404);
    });

    it('400 - invalid idx', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get(`/magazine/invalid-idx`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });
  });

  describe('GET /magazine/all', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        title: 'Test Magazine',
        description: 'Test Description',
        content: 'Test Content',
        thumbnailPath: '/test-image.png',
        isTitleVisible: true,
        activatedAt: new Date(),
        deletedAt: null,
      });

      await magazineLikeSeedHelper.seed({
        magazineIdx: magazineSeed.idx,
        userIdx: loginUser.idx,
      });

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .query({ page: 1 })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(1);
      expect(hasNext).toBe(false);

      const magazine = magazineList[0];

      expect(magazine.idx).toBe(magazineSeed.idx);
      expect(magazine.title).toBe(magazineSeed.title);
      expect(magazine.description).toBe(magazineSeed.description);
      expect(magazine.isTitleVisible).toBe(magazineSeed.isTitleVisible);
      expect(magazine.likeCount).toBe(1);
      expect(magazine.viewCount).toBe(0);
      expect(magazine.thumbnailImagePath).toBe(magazineSeed.thumbnailPath);
      expect(magazine.isLiked).toBe(true);
    });

    it('200 - not select magazine that is not activated', async () => {
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: null,
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get(`/magazine/all`)
        .query({ page: 1 })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(0);
      expect(hasNext).toBe(false);
    });

    it('200 - not select magazine that is deleted', async () => {
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/all`)
        .query({ page: 1 })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(0);
      expect(hasNext).toBe(false);
    });

    it('200 - no magazine', async () => {
      const response = await testHelper
        .test()
        .get(`/magazine/all`)
        .query({ page: 1 })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(0);
      expect(hasNext).toBe(false);
    });

    it('200 - order by check(like)', async () => {
      const [magazine1, magazine2, magazine3] =
        await magazineSeedHelper.seedAll([
          {
            likeCount: 5,
            activatedAt: new Date(),
            deletedAt: null,
          },
          {
            likeCount: 10,
            activatedAt: new Date(),
            deletedAt: null,
          },
          {
            likeCount: 3,
            activatedAt: new Date(),
            deletedAt: null,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .query({ page: 1, orderBy: 'like' })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;

      expect(magazineList.map(({ idx }) => idx)).toStrictEqual([
        magazine2.idx,
        magazine1.idx,
        magazine3.idx,
      ]);
    });

    it('200 - order by check(view)', async () => {
      const [magazine1, magazine2, magazine3] =
        await magazineSeedHelper.seedAll([
          {
            viewCount: 50,
            activatedAt: new Date(),
            deletedAt: null,
          },
          {
            viewCount: 100,
            activatedAt: new Date(),
            deletedAt: null,
          },
          {
            viewCount: 30,
            activatedAt: new Date(),
            deletedAt: null,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .query({ page: 1, orderBy: 'view' })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;

      expect(magazineList.map(({ idx }) => idx)).toStrictEqual([
        magazine2.idx,
        magazine1.idx,
        magazine3.idx,
      ]);
    });

    it('200 - order by check(time)', async () => {
      const [magazine1, magazine2, magazine3] =
        await magazineSeedHelper.seedAll([
          {
            activatedAt: new Date(),
            deletedAt: null,
          },
          {
            activatedAt: new Date(),
            deletedAt: null,
          },
          {
            activatedAt: new Date(),
            deletedAt: null,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .query({ page: 1, orderBy: 'time' })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;

      expect(magazineList.map(({ idx }) => idx)).toStrictEqual([
        magazine3.idx,
        magazine2.idx,
        magazine1.idx,
      ]);
    });

    it('200 - isLiked check when no login', async () => {
      const [magazine1, magazine2] = await magazineSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          deletedAt: null,
        },
        {
          activatedAt: new Date(),
          deletedAt: null,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .query({ page: 1 })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;

      expect(magazineList[0].isLiked).toBe(false);
      expect(magazineList[1].isLiked).toBe(false);
    });

    it('200 - isLiked check when one liked and one not liked', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const [magazine1, magazine2] = await magazineSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          deletedAt: null,
        },
        {
          activatedAt: new Date(),
          deletedAt: null,
        },
      ]);

      await magazineLikeSeedHelper.seed({
        magazineIdx: magazine1.idx,
        userIdx: loginUser.idx,
      });

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .query({ page: 1, orderBy: 'like' })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;

      expect(magazineList[0].isLiked).toBe(true);
      expect(magazineList[1].isLiked).toBe(false);
    });
  });

  describe('GET /magazine/liked/all', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const [magazine1, magazine2, magazine3] =
        await magazineSeedHelper.seedAll([
          {
            likeCount: 5,
            activatedAt: new Date(),
            deletedAt: null,
          },
          {
            likeCount: 10,
            activatedAt: new Date(),
            deletedAt: null,
          },
          {
            likeCount: 3,
            activatedAt: new Date(),
            deletedAt: null,
          },
        ]);

      await magazineLikeSeedHelper.seedAll([
        {
          magazineIdx: magazine1.idx,
          userIdx: loginUser.idx,
        },
        {
          magazineIdx: magazine2.idx,
          userIdx: loginUser.idx,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/magazine/liked/all')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .query({ page: 1, orderBy: 'like' })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(2);
      expect(hasNext).toBe(false);

      expect(magazineList[0].idx).toBe(magazine2.idx);
      expect(magazineList[0].title).toBe(magazine2.title);
      expect(magazineList[0].description).toBe(magazine2.description);
      expect(magazineList[0].thumbnailImagePath).toBe(magazine2.thumbnailPath);
      expect(magazineList[0].likeCount).toBe(magazine2.likeCount + 1);
      expect(magazineList[0].viewCount).toBe(magazine2.viewCount);
      expect(magazineList[0].isLiked).toBe(true);

      expect(magazineList[1].idx).toBe(magazine1.idx);
      expect(magazineList[1].title).toBe(magazine1.title);
      expect(magazineList[1].description).toBe(magazine1.description);
      expect(magazineList[1].thumbnailImagePath).toBe(magazine1.thumbnailPath);
      expect(magazineList[1].likeCount).toBe(magazine1.likeCount + 1);
      expect(magazineList[1].viewCount).toBe(magazine1.viewCount);
      expect(magazineList[1].isLiked).toBe(true);

      expect(magazineList.map(({ idx }) => idx)).toStrictEqual([
        magazine2.idx,
        magazine1.idx,
      ]);
    });

    it('200 - no liked magazine', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const [magazine1, magazine2] = await magazineSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          deletedAt: null,
        },
        {
          activatedAt: new Date(),
          deletedAt: null,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/magazine/liked/all')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .query({ page: 1, orderBy: 'like' })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(0);
      expect(hasNext).toBe(false);
    });
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
