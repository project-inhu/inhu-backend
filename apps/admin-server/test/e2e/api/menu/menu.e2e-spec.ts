import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { MenuSeedHelper, PlaceSeedHelper } from '@libs/testing';
import { MenuEntity } from '@user/api/menu/entity/menu.entity';
import { GetAllMenuResponseDto } from '@admin/api/menu/dto/response/get-all-menu.response.dto';

describe('Menu e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
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
      const loginUser = testHelper.loginAdmin.admin1;

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
        .set('Authorization', `Bearer ${loginUser.token}`)
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
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .query({ page: 1 })
        .expect(200);

      const menuList: MenuEntity[] = response.body.menuList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(menuList)).toBeTruthy();
      expect(menuList.length).toBe(0);
      expect(hasNext).toBe(false);
    });

    it('200 - sort order check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const firstMenuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });

      // 시간 간격을 두어 생성 순서를 명확히 함
      await new Promise((resolve) => setTimeout(resolve, 20));

      const secondMenuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .query({ page: 1 })
        .expect(200);

      const { menuList }: GetAllMenuResponseDto = response.body;

      expect(menuList[0].idx).toBe(firstMenuSeed.idx);
      expect(menuList[1].idx).toBe(secondMenuSeed.idx);
    });

    it('200 - place idx filtering check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const [firstPlaceSeed, secondPlaceSeed] = await placeSeedHelper.seedAll([
        { deletedAt: null, activatedAt: new Date() },
        { deletedAt: null, activatedAt: new Date() },
      ]);

      const [
        menu1OfFirstPlace,
        menu2OfFirstPlace,
        menu3OfSecondPlace,
        menu4OfSecondPlace,
      ] = await menuSeedHelper.seedAll([
        { placeIdx: firstPlaceSeed.idx },
        { placeIdx: firstPlaceSeed.idx },
        { placeIdx: secondPlaceSeed.idx },
        { placeIdx: secondPlaceSeed.idx },
      ]);

      const firstPlaceResponse = await testHelper
        .test()
        .get(`/place/${firstPlaceSeed.idx}/menu`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .query({ page: 1 })
        .expect(200);

      const menusOfFirstPlace = (
        firstPlaceResponse.body as GetAllMenuResponseDto
      ).menuList;

      expect(menusOfFirstPlace.map(({ idx }) => idx).sort()).toStrictEqual(
        [menu1OfFirstPlace.idx, menu2OfFirstPlace.idx].sort(),
      );

      const secondPlaceResponse = await testHelper
        .test()
        .get(`/place/${secondPlaceSeed.idx}/menu`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .query({ page: 1 })
        .expect(200);

      const menusOfSecondPlace = (
        secondPlaceResponse.body as GetAllMenuResponseDto
      ).menuList;

      expect(menusOfSecondPlace.map(({ idx }) => idx).sort()).toStrictEqual(
        [menu3OfSecondPlace.idx, menu4OfSecondPlace.idx].sort(),
      );
    });

    it('400 - invalid placeIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const invalidPlaceIdx = 'invalid';

      await testHelper
        .test()
        .get(`/place/${invalidPlaceIdx}/menu`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .query({ page: 1 })
        .expect(400);
    });

    it('401 - token is missing', async () => {
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });

      await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .query({ page: 1 })
        .expect(401);
    });
  });
});
