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
      expect(menu.placeIdx).toBe(placeSeed.idx);
      expect(menu.name).toBe(menuSeed.name);
      expect(menu.content).toBe(menuSeed.content);
      expect(menu.price).toBe(menuSeed.price);
      expect(menu.isFlexible).toBe(menuSeed.isFlexible);
      expect(menu.imagePath).toBe(menuSeed.imagePath);
    });

    it('200 - hasNext check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      // placeIdx가 place.idx인 메뉴 10개 생성
      await menuSeedHelper.seedAll(
        Array.from({ length: 10 }, () => ({
          placeIdx: placeSeed.idx,
        })),
      );

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .query({
          placeIdx: placeSeed.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const body: GetAllMenuResponseDto = response.body;

      expect(body.hasNext).toBe(false);

      // 10개에서 하나 더 넣기
      await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });

      const response2 = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .query({
          placeIdx: placeSeed.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      expect(response2.body.hasNext).toBe(true);
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

  describe('POST /place/:placeIdx/menu', () => {
    it('201 - field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMenuDto = {
        name: 'Test Menu',
        content: 'Test Content',
        price: 10000,
        isFlexible: false,
        imagePath: '/test-image.png',
      };

      const response = await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/menu`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(createMenuDto)
        .expect(201);

      const menu: MenuEntity = response.body;

      expect(menu.idx).toBeDefined();
      expect(menu.placeIdx).toBe(placeSeed.idx);
      expect(menu.name).toBe(createMenuDto.name);
      expect(menu.content).toBe(createMenuDto.content);
      expect(menu.price).toBe(createMenuDto.price);
      expect(menu.isFlexible).toBe(createMenuDto.isFlexible);
      expect(menu.imagePath).toBe(createMenuDto.imagePath);
    });

    it('201 - create with no optional data', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMenuDto = {
        name: 'Test Menu',
        content: null,
        price: null,
        imagePath: null,
        isFlexible: false,
      };

      const response = await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/menu`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(createMenuDto)
        .expect(201);

      const resultMenu: MenuEntity = response.body;

      expect(resultMenu.name).toBe(createMenuDto.name);
      expect(resultMenu.price).toBeNull();
      expect(resultMenu.content).toBeNull();
      expect(resultMenu.isFlexible).toBe(false);
      expect(resultMenu.imagePath).toBeNull();
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

    it('400 - missing name', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMenuDto = {
        content: null,
        price: null,
        imagePath: null,
      };

      return await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/menu`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(createMenuDto)
        .expect(400);
    });

    it('400 - empty name', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMenuDto = {
        name: '',
        content: null,
        price: null,
        imagePath: null,
      };

      return await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/menu`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(createMenuDto)
        .expect(400);
    });

    it('401 - token is missing', async () => {
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMenuDto = {
        name: 'Test Menu',
        content: null,
        price: null,
        imagePath: null,
        isFlexible: false,
      };

      return await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/menu`)
        .send(createMenuDto)
        .expect(401);
    });

    it('404 - place not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const createMenuDto = {
        name: 'Test Menu',
        content: null,
        price: null,
        imagePath: null,
        isFlexible: false,
      };

      return await testHelper
        .test()
        .post(`/place/99999/menu`) //! 존재하지 않는 장소
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(createMenuDto)
        .expect(404);
    });
  });

  describe('PUT /menu/:menuIdx', () => {
    it('200 - all fields modified', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        name: 'Updated Menu',
        content: 'Updated Content',
        price: 10000,
        isFlexible: true,
        imagePath: 'menu/updated-image.png',
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(200);

      const updatedMenu = await testHelper.getPrisma().menu.findUniqueOrThrow({
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu.name).toBe(updateMenuDto.name);
      expect(updatedMenu.content).toBe(updateMenuDto.content);
      expect(updatedMenu.price).toBe(updateMenuDto.price);
      expect(updatedMenu.isFlexible).toBe(updateMenuDto.isFlexible);
      expect(updatedMenu.imagePath).toBe(updateMenuDto.imagePath);
    });

    it('200 - all fields deleted (keep name)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        name: 'Updated Menu', // ! name은 삭제 불가
        content: null,
        price: null,
        isFlexible: false,
        imagePath: null,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(200);

      const updatedMenu = await testHelper.getPrisma().menu.findUniqueOrThrow({
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu.name).toBe(updateMenuDto.name);
      expect(updatedMenu.content).toBeNull();
      expect(updatedMenu.price).toBeNull();
      expect(updatedMenu.isFlexible).toBe(updateMenuDto.isFlexible);
      expect(updatedMenu.imagePath).toBeNull();
    });

    it('200 - all fields kept', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        name: menuSeed.name,
        content: menuSeed.content,
        price: menuSeed.price,
        isFlexible: menuSeed.isFlexible,
        imagePath: menuSeed.imagePath,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(200);

      const updatedMenu = await testHelper.getPrisma().menu.findUniqueOrThrow({
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu.name).toBe(menuSeed.name);
      expect(updatedMenu.content).toBe(menuSeed.content);
      expect(updatedMenu.price).toBe(menuSeed.price);
      expect(updatedMenu.isFlexible).toBe(menuSeed.isFlexible);
      expect(updatedMenu.imagePath).toBe(menuSeed.imagePath);
    });

    it('200 - name only modified', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        name: 'Updated Menu',
        content: menuSeed.content,
        price: menuSeed.price,
        isFlexible: menuSeed.isFlexible,
        imagePath: menuSeed.imagePath,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(200);

      const updatedMenu = await testHelper.getPrisma().menu.findUniqueOrThrow({
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu.name).toBe(updateMenuDto.name);
      expect(updatedMenu.content).toBe(menuSeed.content);
      expect(updatedMenu.price).toBe(menuSeed.price);
      expect(updatedMenu.isFlexible).toBe(menuSeed.isFlexible);
      expect(updatedMenu.imagePath).toBe(menuSeed.imagePath);
    });

    it('200 - price only modified', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        price: 10000,
        name: menuSeed.name,
        content: menuSeed.content,
        isFlexible: menuSeed.isFlexible,
        imagePath: menuSeed.imagePath,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(200);

      const updatedMenu = await testHelper.getPrisma().menu.findUniqueOrThrow({
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu.name).toBe(menuSeed.name);
      expect(updatedMenu.content).toBe(menuSeed.content);
      expect(updatedMenu.price).toBe(updateMenuDto.price);
      expect(updatedMenu.isFlexible).toBe(menuSeed.isFlexible);
      expect(updatedMenu.imagePath).toBe(menuSeed.imagePath);
    });

    it('200 - content only modified', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        content: 'Updated Content',
        name: menuSeed.name,
        price: menuSeed.price,
        isFlexible: menuSeed.isFlexible,
        imagePath: menuSeed.imagePath,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(200);

      const updatedMenu = await testHelper.getPrisma().menu.findUniqueOrThrow({
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu.name).toBe(menuSeed.name);
      expect(updatedMenu.content).toBe(updateMenuDto.content);
      expect(updatedMenu.price).toBe(menuSeed.price);
      expect(updatedMenu.isFlexible).toBe(menuSeed.isFlexible);
      expect(updatedMenu.imagePath).toBe(menuSeed.imagePath);
    });

    it('200 - imagePath only modified', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        imagePath: 'menu/updated-image.png',
        name: menuSeed.name,
        content: menuSeed.content,
        price: menuSeed.price,
        isFlexible: menuSeed.isFlexible,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(200);

      const updatedMenu = await testHelper.getPrisma().menu.findUniqueOrThrow({
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu.name).toBe(menuSeed.name);
      expect(updatedMenu.content).toBe(menuSeed.content);
      expect(updatedMenu.price).toBe(menuSeed.price);
      expect(updatedMenu.isFlexible).toBe(menuSeed.isFlexible);
      expect(updatedMenu.imagePath).toBe(updateMenuDto.imagePath);
    });

    it('200 - isFlexible only modified', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        isFlexible: true,
        name: menuSeed.name,
        content: menuSeed.content,
        price: menuSeed.price,
        imagePath: menuSeed.imagePath,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(200);

      const updatedMenu = await testHelper.getPrisma().menu.findUniqueOrThrow({
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu.name).toBe(menuSeed.name);
      expect(updatedMenu.content).toBe(menuSeed.content);
      expect(updatedMenu.price).toBe(menuSeed.price);
      expect(updatedMenu.isFlexible).toBe(updateMenuDto.isFlexible);
      expect(updatedMenu.imagePath).toBe(menuSeed.imagePath);
    });

    it('400 - invalid menuIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const updateMenuDto = {
        name: 'Updated Menu',
        content: null,
        price: null,
        isFlexible: false,
        imagePath: null,
      };

      await testHelper
        .test()
        .put(`/menu/invalid`) // ! invalid menuIdx
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(400);
    });

    it('400 - empty content', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        name: '',
        content: null,
        price: null,
        isFlexible: false,
        imagePath: null,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(400);
    });

    it('400 - missing name', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        name: 'Old Menu',
        content: 'Old Content',
        price: 5000,
        isFlexible: false,
        imagePath: 'menu/old-image.png',
      });

      const updateMenuDto = {
        content: null,
        price: null,
        isFlexible: false,
        imagePath: null,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
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

      const updateMenuDto = {
        name: 'Updated Menu',
        content: null,
        price: null,
        isFlexible: false,
        imagePath: null,
      };

      await testHelper
        .test()
        .put(`/menu/${menuSeed.idx}`)
        .send(updateMenuDto)
        .expect(401);
    });

    it('404 - menu does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const updateMenuDto = {
        name: 'Updated Menu',
        content: null,
        price: null,
        isFlexible: false,
        imagePath: null,
      };

      await testHelper
        .test()
        .put(`/menu/99999`) // ! 존재하지 않는 메뉴
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(404);
    });
  });

  describe('DELETE /menu/:menuIdx', () => {
    it('200 - delete check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });

      await testHelper
        .test()
        .delete(`/menu/${menuSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const deletedMenu = await testHelper.getPrisma().menu.findUnique({
        where: { idx: menuSeed.idx },
      });

      expect(deletedMenu?.deletedAt).not.toBeNull();
    });

    it('400 - invalid menuIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete(`/menu/invalid`) // ! invalid menuIdx
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('404 - menu does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete(`/menu/99999`) // ! 존재하지 않는 메뉴
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(404);
    });
  });
});
