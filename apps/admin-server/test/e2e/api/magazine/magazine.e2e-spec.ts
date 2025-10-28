import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { MagazineSeedHelper } from '@libs/testing/seed/magazine/magazine.seed';
import { MagazineEntity } from '@admin/api/magazine/entity/magazine.entity';

describe('Menu e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const magazineSeedHelper = testHelper.seedHelper(MagazineSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /magazine/all', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
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
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, activated: true })
        .expect(200);

      const magazineList: MagazineEntity[] = response.body.magazineList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(1);
      expect(hasNext).toBe(false);

      const magazine: MagazineEntity = magazineList[0];

      expect(magazine.idx).toBe(magazineSeed.idx);
      expect(magazine.title).toBe(magazineSeed.title);
      expect(magazine.description).toBe(magazineSeed.description);
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
      expect(magazine.placeList[0].bookmark).toBe(false);
    });

    it('200 - magazineList empty due to page too high', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      await magazineSeedHelper.seedAll([
        { deletedAt: null, activatedAt: new Date() },
        { deletedAt: null, activatedAt: new Date() },
      ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 2, activated: true })
        .expect(200);

      const magazineList: MagazineEntity[] = response.body.magazineList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(0);
      expect(hasNext).toBe(false);
    });

    it('200 - hasNext true when more than 10 items', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      await magazineSeedHelper.seedAll(
        Array.from({ length: 11 }, () => ({
          deletedAt: null,
          activatedAt: new Date(),
        })),
      );

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, activated: true })
        .expect(200);

      const magazineList: MagazineEntity[] = response.body.magazineList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(10);
      expect(hasNext).toBe(true);
    });

    // TODO 정렬 기준 확실해지면 다시 작성
    // it('200 - activated check(activated: true)', async () => {
    //   const loginUser = testHelper.loginAdmin.admin1;
    //   const [magazine1, magazine2] = await magazineSeedHelper.seedAll([
    //     { deletedAt: null, activatedAt: new Date() },
    //     { deletedAt: null, activatedAt: null },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/magazine/all')
    //     .set('Cookie', `token=Bearer ${loginUser.token}`)
    //     .query({ page: 1, activated: true })
    //     .expect(200);

    //   const magazineList: MagazineEntity[] = response.body.magazineList;
    //   const hasNext: boolean = response.body.hasNext;

    //   expect(magazineList.length).toBe(1);
    //   expect(magazineList[0].idx).toBe(magazine1.idx);
    // });

    // it('200 - activated check(activated: false)', async () => {
    //   const loginUser = testHelper.loginAdmin.admin1;
    //   const [magazine1, magazine2] = await magazineSeedHelper.seedAll([
    //     { deletedAt: null, activatedAt: new Date() },
    //     { deletedAt: null, activatedAt: null },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/magazine/all')
    //     .set('Cookie', `token=Bearer ${loginUser.token}`)
    //     .query({ page: 1, activated: false })
    //     .expect(200);

    //   const magazineList: MagazineEntity[] = response.body.magazineList;
    //   const hasNext: boolean = response.body.hasNext;

    //   expect(magazineList.length).toBe(1);
    //   expect(magazineList[0].idx).toBe(magazine2.idx);
    // });

    // it('200 - activated check(activated: undefined)', async () => {
    //   const loginUser = testHelper.loginAdmin.admin1;
    //   const [magazine1, magazine2] = await magazineSeedHelper.seedAll([
    //     { deletedAt: null, activatedAt: new Date() },
    //     { deletedAt: null, activatedAt: null },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/magazine/all')
    //     .set('Cookie', `token=Bearer ${loginUser.token}`)
    //     .query({ page: 1 })
    //     .expect(200);

    //   const magazineList: MagazineEntity[] = response.body.magazineList;
    //   const hasNext: boolean = response.body.hasNext;

    //   expect(magazineList.length).toBe(2);
    //   expect(magazineList[0].idx).toBe(magazine1.idx);
    //   expect(magazineList[1].idx).toBe(magazine2.idx);
    // });

    it('400 - invalid page', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 'invalid-page', activated: true })
        .expect(400);
    });
  });

  describe('POST /magazine', () => {
    it('201 - successfully create magazine and field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
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

      const createMagazineDto = {
        title: 'New Magazine',
        description: 'New Description',
        content: `This is a new magazine. Look at this!! https://inhu.co.kr/place/${placeSeed.idx}`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;
      const selectMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: resultMagazine.idx },
          include: { placeList: true },
        });

      expect(resultMagazine.idx).toBe(selectMagazine.idx);
      expect(resultMagazine.title).toBe(createMagazineDto.title);
      expect(resultMagazine.description).toBe(createMagazineDto.description);
      expect(resultMagazine.content).toBe(createMagazineDto.content);
      expect(resultMagazine.thumbnailImagePath).toBe(
        createMagazineDto.thumbnailImagePath,
      );
      expect(resultMagazine.isTitleVisible).toBe(
        createMagazineDto.isTitleVisible,
      );
      expect(resultMagazine.activatedAt).toBeNull();
      expect(Array.isArray(resultMagazine.placeList)).toBe(true);
      expect(resultMagazine.placeList.length).toBe(1);
      expect(resultMagazine.placeList[0].idx).toBe(placeSeed.idx);
      expect(resultMagazine.placeList[0].name).toBe(placeSeed.name);
      expect(resultMagazine.placeList[0].tel).toBe(placeSeed.tel);
      expect(resultMagazine.placeList[0].roadAddress).toEqual({
        name: placeSeed.roadAddress.name,
        detail: placeSeed.roadAddress.detail,
        addressX: placeSeed.roadAddress.addressX,
        addressY: placeSeed.roadAddress.addressY,
      });
      expect(resultMagazine.placeList[0].imagePathList).toEqual(
        placeSeed.placeImgList,
      );
      expect(resultMagazine.placeList[0].bookmark).toBe(false);
    });

    it('201 - no place in magazine content (placeIdxList is empty)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const createMagazineDto = {
        title: 'New Magazine',
        content: 'This is a new magazine.',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;

      expect(Array.isArray(resultMagazine.placeList)).toBe(true);
      expect(resultMagazine.placeList.length).toBe(0);
    });

    it('400 - title is empty', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const createMagazineDto = {
        title: '',
        content: 'This is a new magazine.',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
        placeIdxList: null,
      };

      await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(400);
    });

    it('400 - content is empty', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const createMagazineDto = {
        title: 'New Magazine',
        content: '',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
        placeIdxList: null,
      };

      await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(400);
    });
  });

  describe('PATCH /magazine/:idx/activate', () => {
    it('200 - successfully activate magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        deletedAt: null,
        activatedAt: null,
      });

      const updateMagazineDto = {
        activate: true,
      };

      const response = await testHelper
        .test()
        .patch(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(200);

      expect(response.body).toEqual({});

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
        });

      expect(updatedMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully deactivate magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .patch(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: false })
        .expect(200);

      expect(response.body).toEqual({});

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
        });

      expect(updatedMagazine.activatedAt).toBeNull();
    });

    it('400 - invalid magazine idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidMagazineIdx = 'invalid-magazine-idx';

      const updateMagazineDto = {
        activate: true,
      };

      await testHelper
        .test()
        .patch(`/magazine/${invalidMagazineIdx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(400);
    });

    it('404 - magazine not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentMagazineIdx = 9999999;

      const updateMagazineDto = {
        activate: true,
      };

      await testHelper
        .test()
        .patch(`/magazine/${nonExistentMagazineIdx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(404);
    });
  });

  describe('DELETE /magazine/:idx', () => {
    it('200 - successfully delete magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .delete(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      expect(response.body).toEqual({});

      const deletedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
        });

      expect(deletedMagazine.deletedAt).not.toBeNull();
    });

    it('400 - invalid magazine idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidMagazineIdx = 'invalid-magazine-idx';

      await testHelper
        .test()
        .delete(`/magazine/${invalidMagazineIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('404 - magazine not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentMagazineIdx = 9999999;

      await testHelper
        .test()
        .delete(`/magazine/${nonExistentMagazineIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });
  });
});
