import { MenuSeedHelper, PlaceSeedHelper } from '@libs/testing';
import { MenuEntity } from '@user/api/menu/entity/menu.entity';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Menu E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const menuSeedHelper = testHelper.seedHelper(MenuSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /place/:placeIdx/menu', () => {
    it('200 - field check', async () => {
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Test Menu',
        content: 'Test Content',
        price: 10000,
        isFlexible: false,
        imagePath: '/test-image.png',
        deletedAt: null,
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

    it('400 - invalid placeIdx', async () => {
      const invalidPlaceIdx = 'invalid';

      await testHelper
        .test()
        .get(`/place/${invalidPlaceIdx}/menu`)
        .query({ page: 1 })
        .expect(400);
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
  });
});
