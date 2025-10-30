import { BookmarkSeedHelper } from '@libs/testing/seed/bookmark/bookmark.seed';
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
      expect(magazine.likeCount).toBe(0);
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
      const magazineSeed = await magazineSeedHelper.seed({
        title: 'Test Magazine',
        description: 'Test Description',
        content: 'Test Content',
        thumbnailPath: '/test-image.png',
        isTitleVisible: true,
        activatedAt: new Date(),
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get('/magazine/all')
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
      expect(magazine.thumbnailImagePath).toBe(magazineSeed.thumbnailPath);
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
  });

  // describe('POST /magazine/:idx/like', () => {
  //   it('200 - successfully like magazine', async () => {
  //     const loginUser = testHelper.loginUsers.user1;
  //     const magazineSeed = await magazineSeedHelper.seed({
  //       activatedAt: new Date(),
  //       deletedAt: null,
  //     });

  //     await testHelper
  //       .test()
  //       .post(`/magazine/${magazineSeed.idx}/like`)
  //       .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
  //       .expect(200);

  //     const prisma = testHelper.getPrisma();
  //     const magazine = await prisma.magazine.findUnique({
  //       where: { idx: magazineSeed.idx },
  //     });

  //     expect(magazine?.likeCount).toBe(1);
  //   });

  //   it('400 - invalid idx', async () => {
  //     const loginUser = testHelper.loginUsers.user1;

  //     await testHelper
  //       .test()
  //       .post(`/magazine/invalid-idx/like`)
  //       .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
  //       .expect(400);
  //   });

  //   it('404 - magazine not found', async () => {
  //     const loginUser = testHelper.loginUsers.user1;

  //     await testHelper
  //       .test()
  //       .post(`/magazine/9999999/like`)
  //       .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
  //       .expect(404);
  //   });
  // });

  // describe('POST /magazine/:idx/unlike', () => {
  //   it('200 - successfully unlike magazine', async () => {
  //     const loginUser = testHelper.loginUsers.user1;
  //     const magazineSeed = await magazineSeedHelper.seed({
  //       activatedAt: new Date(),
  //       deletedAt: null,
  //       likeCount: 5,
  //     });

  //     await testHelper
  //       .test()
  //       .post(`/magazine/${magazineSeed.idx}/unlike`)
  //       .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
  //       .expect(200);

  //     const prisma = testHelper.getPrisma();
  //     const magazine = await prisma.magazine.findUnique({
  //       where: { idx: magazineSeed.idx },
  //     });

  //     expect(magazine?.likeCount).toBe(4);
  //   });

  //   it('200 - unlike magazine when likeCount is 0 (no effect)', async () => {
  //     const loginUser = testHelper.loginUsers.user1;
  //     const magazineSeed = await magazineSeedHelper.seed({
  //       activatedAt: new Date(),
  //       deletedAt: null,
  //       likeCount: 0,
  //     });

  //     await testHelper
  //       .test()
  //       .post(`/magazine/${magazineSeed.idx}/unlike`)
  //       .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
  //       .expect(200);

  //     const prisma = testHelper.getPrisma();
  //     const magazine = await prisma.magazine.findUnique({
  //       where: { idx: magazineSeed.idx },
  //     });

  //     expect(magazine?.likeCount).toBe(0);
  //   });

  //   it('400 - invalid idx', async () => {
  //     const loginUser = testHelper.loginUsers.user1;

  //     await testHelper
  //       .test()
  //       .post(`/magazine/invalid-idx/unlike`)
  //       .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
  //       .expect(400);
  //   });

  //   it('404 - magazine not found', async () => {
  //     const loginUser = testHelper.loginUsers.user1;

  //     await testHelper
  //       .test()
  //       .post(`/magazine/9999999/unlike`)
  //       .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
  //       .expect(404);
  //   });
  // });
});
