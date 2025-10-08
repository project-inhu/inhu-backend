import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { GetAllMenuResponseDto } from '@admin/api/menu/dto/response/get-all-menu.response.dto';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { MenuSeedHelper } from '@libs/testing/seed/menu/menu.seed';
import { MenuEntity } from '@admin/api/menu/entity/menu.entity';
import { ReviewSeedHelper } from '@libs/testing/seed/review/review.seed';

describe('Menu e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
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
      const loginUser = testHelper.loginAdmin.admin1;

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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, row: 10 })
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
      expect(menu.sortOrder).toBe(1);
      expect(menu.reviewList[0].idx).toBe(reviewSeed.idx);
      expect(menu.reviewList[0].place.idx).toBe(placeSeed.idx);
      expect(menu.reviewList[0].author.idx).toBe(loginUser.idx);
      expect(menu.reviewCount).toBe(1);
    });

    it('200 - no menu review exists', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, row: 10 })
        .expect(200);

      const menuList: MenuEntity[] = response.body.menuList;
      const menu = menuList[0];

      expect(menu.reviewList).toEqual([]);
      expect(menu.reviewCount).toBe(0);
    });

    it('200 - multiple menu review exists', async () => {
      const loginUser1 = testHelper.loginAdmin.admin1;
      const loginUser2 = testHelper.loginAdmin.admin2;
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
        .set('Cookie', `token=Bearer ${loginUser1.token}`)
        .query({ page: 1, row: 10 })
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
        .query({ placeIdx: placeSeed.idx, page: 1, row: 10 })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
          row: 10,
        })
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, row: 10 })
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

      expect(firstMenuSeed.sortOrder).toBe(1);
      expect(secondMenuSeed.sortOrder).toBe(2);

      // 기본적으로 sortOrder는 내림차순으로 정렬되므로, 두 번째 메뉴가 먼저 나와야 함
      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, row: 10, order: 'desc' })
        .expect(200);

      const { menuList }: GetAllMenuResponseDto = response.body;

      expect(menuList[0].idx).toBe(secondMenuSeed.idx);
      expect(menuList[1].idx).toBe(firstMenuSeed.idx);

      // 오름차순 정렬 확인
      const response2 = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}/menu`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, row: 10, order: 'asc' })
        .expect(200);

      const { menuList: menuList2 }: GetAllMenuResponseDto = response2.body;

      expect(menuList2[0].idx).toBe(firstMenuSeed.idx);
      expect(menuList2[1].idx).toBe(secondMenuSeed.idx);
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, row: 10 })
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, row: 10 })
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, row: 10 })
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
        .query({ page: 1, row: 10 })
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
      expect(menu.sortOrder).toBe(1);
      expect(menu.reviewList).toEqual([]);
      expect(menu.reviewCount).toBe(0);
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMenuDto)
        .expect(201);

      const resultMenu: MenuEntity = response.body;

      expect(resultMenu.name).toBe(createMenuDto.name);
      expect(resultMenu.price).toBeNull();
      expect(resultMenu.content).toBeNull();
      expect(resultMenu.isFlexible).toBe(false);
      expect(resultMenu.imagePath).toBeNull();
      expect(resultMenu.sortOrder).toBe(1);
      expect(resultMenu.reviewList).toEqual([]);
      expect(resultMenu.reviewCount).toBe(0);
    });

    it('400 - invalid placeIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const invalidPlaceIdx = 'invalid';

      await testHelper
        .test()
        .get(`/place/${invalidPlaceIdx}/menu`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMenuDto)
        .expect(404);
    });
  });

  describe('POST /menu/:menuIdx/review/:reviewIdx', () => {
    it('201 - successfully create menu review', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
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
        deletedAt: null,
      });

      await testHelper
        .test()
        .post(`/menu/${menuSeed.idx}/review/${reviewSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(201);

      const updatedMenu = await testHelper.getPrisma().menu.findUniqueOrThrow({
        include: { reviewList: true },
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu.reviewList[0].menuIdx).toBe(menuSeed.idx);
      expect(updatedMenu.reviewList[0].reviewIdx).toBe(reviewSeed.idx);
      expect(updatedMenu.reviewList.length).toBe(1);
    });

    it('400 - invalid menuIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const reviewSeed = await reviewSeedHelper.seed({
        placeIdx: placeSeed.idx,
        userIdx: loginUser.idx,
      });

      await testHelper
        .test()
        .post(`/menu/invalid/review/${reviewSeed.idx}`) // ! invalid menuIdx
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('400 - invalid reviewIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        deletedAt: null,
      });

      await testHelper
        .test()
        .post(`/menu/${menuSeed.idx}/review/invalid`) // ! invalid reviewIdx
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('404 - menu not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const reviewSeed = await reviewSeedHelper.seed({
        placeIdx: placeSeed.idx,
        userIdx: loginUser.idx,
      });

      await testHelper
        .test()
        .post(`/menu/99999/review/${reviewSeed.idx}`) // ! 존재하지 않는 메뉴
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('404 - review not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        deletedAt: null,
      });

      await testHelper
        .test()
        .post(`/menu/${menuSeed.idx}/review/99999`) // ! 존재하지 않는 리뷰
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMenuDto)
        .expect(404);
    });
  });

  describe('PUT /menu/:menuIdx/sort-order', () => {
    it('200 - successfully change to medium position', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed1 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      const menuSeed2 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      const menuSeed3 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      expect(menuSeed1.sortOrder).toBe(1);
      expect(menuSeed2.sortOrder).toBe(2);
      expect(menuSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/menu/${menuSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ sortOrder: 2 }) // 1번 메뉴를 2번 위치로 이동
        .expect(200);

      const prisma = testHelper.getPrisma();
      const updatedMenu1 = await prisma.menu.findUnique({
        where: { idx: menuSeed1.idx },
      });
      const updatedMenu2 = await prisma.menu.findUnique({
        where: { idx: menuSeed2.idx },
      });
      const updatedMenu3 = await prisma.menu.findUnique({
        where: { idx: menuSeed3.idx },
      });
      expect(updatedMenu1?.sortOrder).toBe(2);
      expect(updatedMenu2?.sortOrder).toBe(1);
      expect(updatedMenu3?.sortOrder).toBe(3);
    });

    it('200 - successfully change to last position', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed1 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      const menuSeed2 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      const menuSeed3 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      expect(menuSeed1.sortOrder).toBe(1);
      expect(menuSeed2.sortOrder).toBe(2);
      expect(menuSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/menu/${menuSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ sortOrder: 3 }) // 1번 메뉴를 3번 위치로 이동
        .expect(200);

      const prisma = testHelper.getPrisma();
      const updatedMenu1 = await prisma.menu.findUnique({
        where: { idx: menuSeed1.idx },
      });
      const updatedMenu2 = await prisma.menu.findUnique({
        where: { idx: menuSeed2.idx },
      });
      const updatedMenu3 = await prisma.menu.findUnique({
        where: { idx: menuSeed3.idx },
      });
      expect(updatedMenu1?.sortOrder).toBe(3);
      expect(updatedMenu2?.sortOrder).toBe(1);
      expect(updatedMenu3?.sortOrder).toBe(2);
    });

    it('200 - no change to move in place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed1 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      const menuSeed2 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      const menuSeed3 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      expect(menuSeed1.sortOrder).toBe(1);
      expect(menuSeed2.sortOrder).toBe(2);
      expect(menuSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/menu/${menuSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ sortOrder: 1 }) // 1번 메뉴를 1번 위치로 이동 (변경 없음)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const updatedMenu1 = await prisma.menu.findUnique({
        where: { idx: menuSeed1.idx },
      });
      const updatedMenu2 = await prisma.menu.findUnique({
        where: { idx: menuSeed2.idx },
      });
      const updatedMenu3 = await prisma.menu.findUnique({
        where: { idx: menuSeed3.idx },
      });
      expect(updatedMenu1?.sortOrder).toBe(1);
      expect(updatedMenu2?.sortOrder).toBe(2);
      expect(updatedMenu3?.sortOrder).toBe(3);
    });

    it('400 - invalid sortOrder (a value that exceeds the menu count)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed1 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });

      await testHelper
        .test()
        .put(`/menu/${menuSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ sortOrder: 3 })
        .expect(400);
    });

    it('404 - menu does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put(`/menu/99999/sort-order`) // ! 존재하지 않는 메뉴
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ sortOrder: 2 })
        .expect(404);
    });
  });

  describe('DELETE /menu/:menuIdx', () => {
    it('200 - single menu delete check', async () => {
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
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const deletedMenu = await testHelper.getPrisma().menu.findUnique({
        where: { idx: menuSeed.idx },
      });
      expect(deletedMenu?.deletedAt).not.toBeNull();
    });

    it('200 - multi menu delete check (reorder sort_order)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const menuSeed1 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      const menuSeed2 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      const menuSeed3 = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
      });
      expect(menuSeed1.sortOrder).toBe(1);
      expect(menuSeed2.sortOrder).toBe(2);
      expect(menuSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .delete(`/menu/${menuSeed1.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedMenu = await prisma.menu.findUnique({
        where: { idx: menuSeed1.idx },
      });
      expect(deletedMenu?.deletedAt).not.toBeNull();

      const menu2 = await prisma.menu.findUnique({
        where: { idx: menuSeed2.idx },
      });
      expect(menu2?.sortOrder).toBe(1);

      const menu3 = await prisma.menu.findUnique({
        where: { idx: menuSeed3.idx },
      });
      expect(menu3?.sortOrder).toBe(2);
    });

    it('400 - invalid menuIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete(`/menu/invalid`) // ! invalid menuIdx
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('404 - menu does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete(`/menu/99999`) // ! 존재하지 않는 메뉴
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });
  });

  describe('DELETE /mnu/:menuIdx/review/:reviewIdx', () => {
    it('200 - successfully delete menu review', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
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
        deletedAt: null,
      });

      // 먼저 메뉴리뷰를 등록
      await testHelper
        .test()
        .post(`/menu/${menuSeed.idx}/review/${reviewSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(201);

      // 등록된 메뉴리뷰를 삭제
      await testHelper
        .test()
        .delete(`/menu/${menuSeed.idx}/review/${reviewSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const updatedMenu = await testHelper.getPrisma().menu.findFirst({
        include: { reviewList: true },
        where: { idx: menuSeed.idx },
      });

      expect(updatedMenu?.reviewList.length).toBe(0);
    });

    it('400 - invalid menuIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const reviewSeed = await reviewSeedHelper.seed({
        placeIdx: placeSeed.idx,
        userIdx: loginUser.idx,
      });

      await testHelper
        .test()
        .delete(`/menu/invalid/review/${reviewSeed.idx}`) // ! invalid menuIdx
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('400 - invalid reviewIdx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const menuSeed = await menuSeedHelper.seed({
        placeIdx: placeSeed.idx,
        deletedAt: null,
      });

      await testHelper
        .test()
        .delete(`/menu/${menuSeed.idx}/review/invalid`) // ! invalid reviewIdx
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('404 - menu review not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
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
        deletedAt: null,
      });

      await testHelper
        .test()
        .delete(`/menu/${menuSeed.idx}/review/${reviewSeed.idx}`) // ! 존재하지 않는 메뉴리뷰
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });
  });
});
