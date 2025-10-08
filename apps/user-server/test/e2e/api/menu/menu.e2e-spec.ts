import { MenuSeedHelper } from '@libs/testing/seed/menu/menu.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { ReviewSeedHelper } from '@libs/testing/seed/review/review.seed';
import { MenuEntity } from '@user/api/menu/entity/menu.entity';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Menu E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const menuSeedHelper = testHelper.seedHelper(MenuSeedHelper);
  const reviewSeedHelper = testHelper.seedHelper(ReviewSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /place/:placeIdx/menu', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const reviewSeed = await reviewSeedHelper.seed({
        placeIdx: placeSeed.idx,
        userIdx: loginUser.idx,
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Test Menu',
        content: 'Test Content',
        price: 10000,
        isFlexible: false,
        imagePath: '/test-image.png',
        deletedAt: null,
        reviewIdxList: [reviewSeed.idx],
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .query({ page: 1 })
        .expect(200);

      const menuList: MenuEntity[] = response.body.menuList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(menuList)).toBe(true);
      expect(menuList.length).toBeGreaterThan(0);
      expect(hasNext).toBe(false);

      const menu = menuList[0];

      expect(menu.idx).toBe(menuSeed.idx);
      expect(menu.name).toBe(menuSeed.name);
      expect(menu.content).toBe(menuSeed.content);
      expect(menu.price).toBe(menuSeed.price);
      expect(menu.isFlexible).toBe(menuSeed.isFlexible);
      expect(menu.imagePath).toBe(menuSeed.imagePath);
      expect(menu.reviewList[0].idx).toBe(reviewSeed.idx);
      expect(menu.reviewList[0].place.idx).toBe(placeSeed.idx);
      expect(menu.reviewList[0].author.idx).toBe(loginUser.idx);
      expect(menu.reviewCount).toBe(1);
    });

    it('200 - no menu review exists', async () => {
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .query({ page: 1 })
        .expect(200);

      const menuList: MenuEntity[] = response.body.menuList;
      const menu = menuList[0];

      expect(menu.reviewList).toEqual([]);
      expect(menu.reviewCount).toBe(0);
    });

    it('200 - multiple menu review exists', async () => {
      const loginUser1 = testHelper.loginUsers.user1;
      const loginUser2 = testHelper.loginUsers.user2;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const [review1, review2] = await reviewSeedHelper.seedAll([
        {
          placeIdx: placeSeed.idx,
          userIdx: loginUser1.idx,
        },
        {
          placeIdx: placeSeed.idx,
          userIdx: loginUser2.idx,
        },
      ]);
      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        deletedAt: null,
        reviewIdxList: [review1.idx, review2.idx],
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .query({ page: 1 })
        .expect(200);

      const menuList: MenuEntity[] = response.body.menuList;
      const menu = menuList[0];

      expect(menu.reviewList[0].idx).toBe(review1.idx);
      expect(menu.reviewList[0].place.idx).toBe(placeSeed.idx);
      expect(menu.reviewList[0].author.idx).toBe(loginUser1.idx);
      expect(menu.reviewList[1].idx).toBe(review2.idx);
      expect(menu.reviewList[1].place.idx).toBe(placeSeed.idx);
      expect(menu.reviewList[1].author.idx).toBe(loginUser2.idx);
      expect(menu.reviewCount).toBe(2);
    });

    it('200 - should return empty menu list if no menus exist for the place', async () => {
      const placeIdx = 9999; // Assuming this place does not exist
      const response = await testHelper
        .test()
        .get(`/place/${placeIdx}/menu`)
        .query({ page: 1 })
        .expect(200);

      const menuList: MenuEntity[] = response.body.menuList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(menuList)).toBeTruthy();
      expect(menuList.length).toBe(0);
      expect(hasNext).toBe(false);
    });

    it('200 - check deleted menus are not returned', async () => {
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const [deletedMenu, menu1, menu2, menu3] = await menuSeedHelper.seedAll([
        { deletedAt: new Date(), placeIdx: placeSeed.idx },
        { deletedAt: null, placeIdx: placeSeed.idx },
        { deletedAt: null, placeIdx: placeSeed.idx },
        { deletedAt: null, placeIdx: placeSeed.idx },
      ]);

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .query({ page: 1 })
        .expect(200);

      const menuList: MenuEntity[] = response.body.menuList;
      const hasNext: boolean = response.body.hasNext;

      expect(menuList.length).toBe(3);
      expect(menuList.some((menu) => menu.idx === deletedMenu.idx)).toBe(false);
    });

    it('400 - invalid placeIdx', async () => {
      const invalidPlaceIdx = 'invalid';

      await testHelper
        .test()
        .get(`/place/${invalidPlaceIdx}/menu`)
        .query({ page: 1 })
        .expect(400);
    });
  });
});
