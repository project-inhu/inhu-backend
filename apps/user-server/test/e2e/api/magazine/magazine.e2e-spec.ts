import { BookmarkSeedHelper } from '@libs/testing/seed/bookmark/bookmark.seed';
import { MagazineSeedHelper } from '@libs/testing/seed/magazine/magazine.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
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
      expect(magazine.content).toBe(magazineSeed.content);
      expect(magazine.thumbnailImagePath).toBe(magazineSeed.thumbnailPath);
      expect(magazine.isTitleVisible).toBe(magazineSeed.isTitleVisible);
      expect(magazine.activatedAt).not.toBeNull();
      expect(magazine.activatedAt).toEqual(
        magazineSeed.activatedAt?.toISOString(),
      );
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

    it('200 - magazine not exists', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const response = await testHelper
        .test()
        .get(`/magazine/999999`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const magazine: MagazineEntity = response.body;

      expect(magazine).toEqual({});
    });

    // it('200 - does not select magazine that is not activated', async () => {
    //   const loginUser = testHelper.loginUsers.user1;
    //   const magazineSeed = await magazineSeedHelper.seed({
    //     activatedAt: null,
    //     deletedAt: null,
    //   });

    //   const response = await testHelper
    //     .test()
    //     .get(`/magazine/${magazineSeed.idx}`)
    //     .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
    //     .expect(200);

    //   const magazine: MagazineEntity = response.body;

    //   expect(magazine).toEqual({});
    // });

    it('200 - does not select magazine that is deleted', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      const magazine: MagazineEntity = response.body;

      expect(magazine).toEqual({});
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

  describe('GET /magazine/overview/all', () => {
    it('200 - field check', async () => {
      const magazineSeed = await magazineSeedHelper.seed({
        title: 'Test Magazine',
        content: 'Test Content',
        thumbnailPath: '/test-image.png',
        isTitleVisible: true,
        activatedAt: new Date(),
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get(`/magazine/overview/all`)
        .query({ take: 10 })
        .expect(200);

      const magazineList: MagazineEntity[] = response.body;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(1);

      const magazine = magazineList[0];

      expect(magazine.idx).toBe(magazineSeed.idx);
      expect(magazine.title).toBe(magazineSeed.title);
      expect(magazine.thumbnailImagePath).toBe(magazineSeed.thumbnailPath);
      expect(magazine.isTitleVisible).toBe(magazineSeed.isTitleVisible);
      expect(magazine.activatedAt).not.toBeNull();
      expect(magazine.activatedAt).toEqual(
        magazineSeed.activatedAt?.toISOString(),
      );
    });

    it('200 - not select magazine that is not activated', async () => {
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: null,
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get(`/magazine/overview/all`)
        .query({ take: 10 })
        .expect(200);

      const magazineList: MagazineEntity[] = response.body;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(0);
    });

    it('200 - not select magazine that is deleted', async () => {
      const magazineSeed = await magazineSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/overview/all`)
        .query({ take: 10 })
        .expect(200);

      const magazineList: MagazineEntity[] = response.body;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(0);
    });

    it('200 - no magazine', async () => {
      const response = await testHelper
        .test()
        .get(`/magazine/overview/all`)
        .query({ take: 10 })
        .expect(200);

      const magazineList: MagazineEntity[] = response.body;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(0);
    });

    it('400 - invalid take', async () => {
      await testHelper
        .test()
        .get(`/magazine/overview/all`)
        .query({ take: 'invalid-take' })
        .expect(400);
    });
  });
});
