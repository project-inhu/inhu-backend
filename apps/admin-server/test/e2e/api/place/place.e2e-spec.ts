import { AdminServerModule } from '@admin/admin-server.module';
import { CreatePlaceDto } from '@admin/api/place/dto/request/create-place.dto';
import { GetPlaceOverviewDto } from '@admin/api/place/dto/request/get-place-overview-all.dto';
import { UpdatePlaceDto } from '@admin/api/place/dto/request/update-place.dto';
import { PlaceOverviewEntity } from '@admin/api/place/entity/place-overview.entity';
import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { dayOfWeeks } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { PLACE_TYPE } from '@libs/core/place/constants/place-type.constant';
import { WEEKLY_CLOSE_TYPE } from '@libs/core/place/constants/weekly-close-type.constant';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { TestHelper } from 'apps/admin-server/test/e2e/setup/test.helper';

describe('Place E2E test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /place', () => {
    it('200 - field check', async () => {
      const dto: GetPlaceOverviewDto = {
        page: 1,
      };

      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({});

      const response = await testHelper
        .test()
        .get('/place')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const place: PlaceOverviewEntity = response.body.placeList[0];
      const count: number = response.body.count;

      expect(count).toBe(1);

      expect(place.idx).toBe(placeSeed.idx);
      expect(place.name).toBe(placeSeed.name);
      expect(place.roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(placeSeed.roadAddress.addressX);
      expect(place.roadAddress.addressY).toBe(placeSeed.roadAddress.addressY);
      expect(place.reviewCount).toBe(placeSeed.reviewCount);
      expect(place.type).toBe(placeSeed.type);
    });

    it('401 - no access token provided', async () => {
      const dto: GetPlaceOverviewDto = {
        page: 1,
      };

      await testHelper.test().get('/place').query(dto).expect(401);
    });

    it('400 - invalid page', async () => {
      const dto = {
        page: 'invalid page',
      };

      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/place')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .query(dto)
        .expect(400);
    });

    it('200 - check active filtering', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        active: true,
      };

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: null,
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places.map(({ name }) => name).sort()).toStrictEqual(
        [place3.name, place1.name].sort(),
      );
      expect(count).toBe(2);
    });
  });

  describe('GET /place/:idx', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        name: 'Test Place',
        tel: '032-1111-2222',
        roadAddress: {
          name: 'Test Road',
          detail: 'Test Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        type: PLACE_TYPE.CAFE,
        reviewCount: 5,
        placeImgList: ['/place/test-image1.png', '/place/test-image2.png'],
        bookmarkCount: 1,
        isClosedOnHoliday: false,
        deletedAt: null,
        permanentlyClosedAt: null,
        keywordCountList: [
          {
            keywordIdx: 1,
            count: 10,
          },
          {
            keywordIdx: 2,
            count: 12,
          },
          {
            keywordIdx: 3,
            count: 8,
          },
        ],
        breakTime: [
          {
            day: dayOfWeeks.THU,
            startAt: now.new('12:00'),
            endAt: now.new('13:00'),
          },
          {
            day: dayOfWeeks.THU,
            startAt: now.new('20:00'),
            endAt: now.new('21:00'),
          },
        ],
        operatingHourList: [
          {
            day: dayOfWeeks.FRI,
            startAt: now.new('10:00'),
            endAt: now.new('20:00'),
          },
          {
            day: dayOfWeeks.SAT,
            startAt: now.new('10:00'),
            endAt: now.new('20:00'),
          },
        ],
        weeklyClosedDayList: [
          {
            closedDate: now.new(),
            type: WEEKLY_CLOSE_TYPE.BIWEEKLY,
          },
          {
            closedDate: now.dateAfter(1),
            type: WEEKLY_CLOSE_TYPE.BIWEEKLY,
          },
        ],
        closedDayList: [
          {
            day: dayOfWeeks.FRI,
            week: 1,
          },
          {
            day: dayOfWeeks.SAT,
            week: 2,
          },
        ],
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const place: PlaceEntity = response.body;

      expect(place.idx).toBe(placeSeed.idx);
      expect(place.name).toBe(placeSeed.name);
      expect(place.roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(placeSeed.roadAddress.addressX);
      expect(place.roadAddress.addressY).toBe(placeSeed.roadAddress.addressY);
      expect(place.reviewCount).toBe(placeSeed.reviewCount);
      expect(place.topKeywordList.map(({ idx }) => idx)).toStrictEqual([2, 1]);
      expect(place.imagePathList.sort()).toEqual(place.imagePathList.sort());
      expect(place.isClosedOnHoliday).toBe(placeSeed.isClosedOnHoliday);
      expect(place.type).toBe(placeSeed.type);
      expect(place.breakTimeList.length).toBe(2);
      expect(place.breakTimeList[0].startAt).toBe('12:00:00');
      expect(place.breakTimeList[0].endAt).toBe('13:00:00');
      expect(place.breakTimeList[1].startAt).toBe('20:00:00');
      expect(place.breakTimeList[1].endAt).toBe('21:00:00');
      expect(place.operatingHourList.length).toBe(2);
      expect(place.operatingHourList[0].startAt).toBe('10:00:00');
      expect(place.operatingHourList[0].endAt).toBe('20:00:00');
      expect(place.operatingHourList[1].startAt).toBe('10:00:00');
      expect(place.operatingHourList[1].endAt).toBe('20:00:00');
      expect(place.weeklyClosedDayList.length).toBe(2);
      expect(place.weeklyClosedDayList[0].date).toBe(
        now.new().toISOString().split('T')[0],
      );
      expect(place.weeklyClosedDayList[0].type).toBe(
        WEEKLY_CLOSE_TYPE.BIWEEKLY,
      );
      expect(place.weeklyClosedDayList[1].date).toBe(
        now.dateAfter(1).toISOString().split('T')[0],
      );
      expect(place.weeklyClosedDayList[1].type).toBe(
        WEEKLY_CLOSE_TYPE.BIWEEKLY,
      );
      expect(place.closedDayList.length).toBe(2);
      expect(place.closedDayList[0].day).toBe(dayOfWeeks.FRI);
      expect(place.closedDayList[0].week).toBe(1);
      expect(place.closedDayList[1].day).toBe(dayOfWeeks.SAT);
      expect(place.closedDayList[1].week).toBe(2);
    });

    it('200 - not activated place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
        activatedAt: null,
        deletedAt: null,
      });

      await testHelper
        .test()
        .get(`/place/${place.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);
    });

    it('404 - deleted place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(),
      });

      await testHelper
        .test()
        .get(`/place/${place.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('401 - no token provided', async () => {
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      await testHelper.test().get(`/place/${place.idx}`).expect(401);
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx';

      await testHelper
        .test()
        .get(`/place/${invalidPlaceIdx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });
  });

  describe('POST /place', () => {
    it('200 - field check', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'New Place',
        tel: '032-1234-5678',
        isClosedOnHoliday: false,
        imagePathList: ['/place/image1.png', '/place/image2.png'],
        type: PLACE_TYPE.RESTAURANT,
        roadAddress: {
          name: 'New Road',
          detail: 'New Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        closedDayList: [
          { day: dayOfWeeks.MON, week: 1 },
          { day: dayOfWeeks.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: dayOfWeeks.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: dayOfWeeks.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: dayOfWeeks.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: dayOfWeeks.SAT },
        ],
        weeklyClosedDayList: [
          { date: '2025-07-22', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
          { date: '2025-07-23', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
        ],
      };

      const loginUser = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .post('/place')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(createPlaceDto)
        .expect(200);

      const place: PlaceEntity = response.body;

      expect(place.name).toBe(createPlaceDto.name);
      expect(place.roadAddress.name).toBe(createPlaceDto.roadAddress.name);
      expect(place.roadAddress.detail).toBe(createPlaceDto.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(
        createPlaceDto.roadAddress.addressX,
      );
      expect(place.roadAddress.addressY).toBe(
        createPlaceDto.roadAddress.addressY,
      );
      expect(place.imagePathList.sort()).toEqual(place.imagePathList.sort());
      expect(place.isClosedOnHoliday).toBe(createPlaceDto.isClosedOnHoliday);
      expect(place.type).toBe(createPlaceDto.type);
      expect(place.breakTimeList.length).toBe(2);
      expect(place.breakTimeList[0].startAt).toBe('12:00:00');
      expect(place.breakTimeList[0].endAt).toBe('13:00:00');
      expect(place.breakTimeList[0].day).toBe(dayOfWeeks.WED);
      expect(place.breakTimeList[1].startAt).toBe('14:00:00');
      expect(place.breakTimeList[1].endAt).toBe('15:00:00');
      expect(place.breakTimeList[1].day).toBe(dayOfWeeks.FRI);
      expect(place.operatingHourList.length).toBe(2);
      expect(place.operatingHourList[0].startAt).toBe('10:00:00');
      expect(place.operatingHourList[0].endAt).toBe('20:00:00');
      expect(place.operatingHourList[0].day).toBe(dayOfWeeks.THU);
      expect(place.operatingHourList[1].startAt).toBe('11:00:00');
      expect(place.operatingHourList[1].endAt).toBe('21:00:00');
      expect(place.operatingHourList[1].day).toBe(dayOfWeeks.SAT);
      expect(place.weeklyClosedDayList.length).toBe(2);
      expect(place.weeklyClosedDayList[0].date).toBe(
        createPlaceDto.weeklyClosedDayList[0].date,
      );
      expect(place.weeklyClosedDayList[0].type).toBe(
        createPlaceDto.weeklyClosedDayList[0].type,
      );
      expect(place.weeklyClosedDayList[1].date).toBe(
        createPlaceDto.weeklyClosedDayList[1].date,
      );
      expect(place.weeklyClosedDayList[1].type).toBe(
        createPlaceDto.weeklyClosedDayList[1].type,
      );
      expect(place.closedDayList.length).toBe(2);
      expect(place.closedDayList[0].day).toBe(dayOfWeeks.MON);
      expect(place.closedDayList[0].week).toBe(1);
      expect(place.closedDayList[1].day).toBe(dayOfWeeks.TUE);
      expect(place.closedDayList[1].week).toBe(2);
    });

    it('401 - no access token', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'New Place',
        tel: '032-1234-5678',
        isClosedOnHoliday: false,
        imagePathList: ['/place/image1.png', '/place/image2.png'],
        type: PLACE_TYPE.RESTAURANT,
        roadAddress: {
          name: 'New Road',
          detail: 'New Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        closedDayList: [
          { day: dayOfWeeks.MON, week: 1 },
          { day: dayOfWeeks.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: dayOfWeeks.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: dayOfWeeks.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: dayOfWeeks.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: dayOfWeeks.SAT },
        ],
        weeklyClosedDayList: [
          { date: '2025-07-22', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
          { date: '2025-07-23', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
        ],
      };

      await testHelper.test().post('/place').send(createPlaceDto).expect(401);
    });

    it('401 - ensures invalid times are rejected by IsKoreanTime decorator', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'New Place',
        tel: '032-1234-5678',
        isClosedOnHoliday: false,
        imagePathList: ['/place/image1.png', '/place/image2.png'],
        type: PLACE_TYPE.RESTAURANT,
        roadAddress: {
          name: 'New Road',
          detail: 'New Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        closedDayList: [],
        breakTimeList: [
          { startAt: '12:00:00.00z', endAt: '13:00:00', day: dayOfWeeks.WED },
        ],
        operatingHourList: [],
        weeklyClosedDayList: [],
      };

      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/place')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(createPlaceDto)
        .expect(400);
    });

    it('400 - ensures invalid date are rejected by IsKoreanDate decorator', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'New Place',
        tel: '032-1234-5678',
        isClosedOnHoliday: false,
        imagePathList: ['/place/image1.png', '/place/image2.png'],
        type: PLACE_TYPE.RESTAURANT,
        roadAddress: {
          name: 'New Road',
          detail: 'New Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        closedDayList: [],
        breakTimeList: [],
        operatingHourList: [],
        weeklyClosedDayList: [
          { date: '2025/07/01', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
        ],
      };

      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/place')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(createPlaceDto)
        .expect(400);
    });
  });

  describe('PUT /place/:idx', () => {
    it('200 - confirms fields are updated successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      const updatePlaceDto: UpdatePlaceDto = {
        name: 'Updated Place',
        tel: '032-9876-5432',
        isClosedOnHoliday: true,
        imagePathList: [
          '/place/updated-image1.png',
          '/place/updated-image2.png',
        ],
        type: PLACE_TYPE.RESTAURANT,
        roadAddress: {
          name: 'Updated Road',
          detail: 'Updated Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        closedDayList: [
          { day: dayOfWeeks.MON, week: 1 },
          { day: dayOfWeeks.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: dayOfWeeks.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: dayOfWeeks.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: dayOfWeeks.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: dayOfWeeks.SAT },
        ],
        weeklyClosedDayList: [
          { date: '2025-07-22', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
          { date: '2025-07-23', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
        ],
      };

      await testHelper
        .test()
        .put(`/place/${place.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updatePlaceDto)
        .expect(200);

      const placeModel = await testHelper
        .get(PlaceCoreService)
        .getPlaceByIdx(place.idx);

      if (!placeModel) {
        throw new Error('Place not found after update');
      }

      expect(placeModel.name).toBe(updatePlaceDto.name);
      expect(placeModel.tel).toBe(updatePlaceDto.tel);
      expect(placeModel.isClosedOnHoliday).toBe(
        updatePlaceDto.isClosedOnHoliday,
      );
      expect(placeModel.type).toBe(updatePlaceDto.type);
      expect(placeModel.roadAddress.name).toBe(updatePlaceDto.roadAddress.name);
      expect(placeModel.roadAddress.detail).toBe(
        updatePlaceDto.roadAddress.detail,
      );
      expect(placeModel.roadAddress.addressX).toBe(
        updatePlaceDto.roadAddress.addressX,
      );
      expect(placeModel.roadAddress.addressY).toBe(
        updatePlaceDto.roadAddress.addressY,
      );
      expect(placeModel.imgPathList.sort()).toEqual(
        updatePlaceDto.imagePathList.sort(),
      );
      expect(placeModel.closedDayList.length).toBe(2);
      expect(placeModel.closedDayList[0].day).toBe(dayOfWeeks.MON);
      expect(placeModel.closedDayList[0].week).toBe(1);
      expect(placeModel.closedDayList[1].day).toBe(dayOfWeeks.TUE);
      expect(placeModel.closedDayList[1].week).toBe(2);
      expect(placeModel.breakTimeList.length).toBe(2);
      expect(placeModel.breakTimeList[0].startAt).toBe('12:00:00');
      expect(placeModel.breakTimeList[0].endAt).toBe('13:00:00');
      expect(placeModel.breakTimeList[0].day).toBe(dayOfWeeks.WED);
      expect(placeModel.breakTimeList[1].startAt).toBe('14:00:00');
      expect(placeModel.breakTimeList[1].endAt).toBe('15:00:00');
      expect(placeModel.breakTimeList[1].day).toBe(dayOfWeeks.FRI);
      expect(placeModel.operatingHourList.length).toBe(2);
      expect(placeModel.operatingHourList[0].startAt).toBe('10:00:00');
      expect(placeModel.operatingHourList[0].endAt).toBe('20:00:00');
      expect(placeModel.operatingHourList[0].day).toBe(dayOfWeeks.THU);
      expect(placeModel.operatingHourList[1].startAt).toBe('11:00:00');
      expect(placeModel.operatingHourList[1].endAt).toBe('21:00:00');
      expect(placeModel.operatingHourList[1].day).toBe(dayOfWeeks.SAT);
      expect(placeModel.weeklyClosedDayList.length).toBe(2);
      expect(placeModel.weeklyClosedDayList[0].date).toBe(
        updatePlaceDto.weeklyClosedDayList[0].date,
      );
      expect(placeModel.weeklyClosedDayList[0].type).toBe(
        updatePlaceDto.weeklyClosedDayList[0].type,
      );
      expect(placeModel.weeklyClosedDayList[1].date).toBe(
        updatePlaceDto.weeklyClosedDayList[1].date,
      );
      expect(placeModel.weeklyClosedDayList[1].type).toBe(
        updatePlaceDto.weeklyClosedDayList[1].type,
      );
    });

    it('401 - no access token provided', async () => {
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      const updatePlaceDto: UpdatePlaceDto = {
        name: 'Updated Place',
        tel: '032-9876-5432',
        isClosedOnHoliday: true,
        imagePathList: [
          '/place/updated-image1.png',
          '/place/updated-image2.png',
        ],
        type: PLACE_TYPE.RESTAURANT,
        roadAddress: {
          name: 'Updated Road',
          detail: 'Updated Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        closedDayList: [
          { day: dayOfWeeks.MON, week: 1 },
          { day: dayOfWeeks.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: dayOfWeeks.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: dayOfWeeks.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: dayOfWeeks.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: dayOfWeeks.SAT },
        ],
        weeklyClosedDayList: [
          { date: '2025-07-22', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
          { date: '2025-07-23', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
        ],
      };

      await testHelper
        .test()
        .put(`/place/${place.idx}`)
        .send(updatePlaceDto)
        .expect(401);
    });

    it('404 - there is no place with the given idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeIdx = -1; // ! no place with this idx

      const updatePlaceDto: UpdatePlaceDto = {
        name: 'Updated Place',
        tel: '032-9876-5432',
        isClosedOnHoliday: true,
        imagePathList: [
          '/place/updated-image1.png',
          '/place/updated-image2.png',
        ],
        type: PLACE_TYPE.RESTAURANT,
        roadAddress: {
          name: 'Updated Road',
          detail: 'Updated Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        closedDayList: [
          { day: dayOfWeeks.MON, week: 1 },
          { day: dayOfWeeks.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: dayOfWeeks.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: dayOfWeeks.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: dayOfWeeks.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: dayOfWeeks.SAT },
        ],
        weeklyClosedDayList: [
          { date: '2025-07-22', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
          { date: '2025-07-23', type: WEEKLY_CLOSE_TYPE.BIWEEKLY },
        ],
      };

      await testHelper
        .test()
        .put(`/place/${placeIdx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .send(updatePlaceDto)
        .expect(404);
    });
  });

  describe('DELETE /place/:idx', () => {
    it('200 - confirms place is deleted successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .delete(`/place/${place.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const placeAfterDelete = await testHelper
        .getPrisma()
        .place.findUniqueOrThrow({
          where: { idx: place.idx },
        });

      expect(placeAfterDelete.deletedAt).not.toBeNull();
    });

    it('404 - attempt to delete a place that was already deleted', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(), // ! already deleted
      });

      await testHelper
        .test()
        .delete(`/place/${place.idx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('401 - no access token provided', async () => {
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper.test().delete(`/place/${place.idx}`).expect(401);
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx';

      await testHelper
        .test()
        .delete(`/place/${invalidPlaceIdx}`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });
  });

  describe('POST /place/:idx/activate', () => {
    it('200 - confirms place is activated successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/activate`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const place = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: placeSeed.idx },
      });

      expect(place.activatedAt).not.toBeNull();
    });

    it('400 - attempt to activate a place with invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx'; // ! invalid place idx

      await testHelper
        .test()
        .post(`/place/${invalidPlaceIdx}/activate`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('401 - no access token provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/activate`)
        .expect(401);
    });

    it('404 - attempt to activate a place that does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = -1; // ! no place with this idx

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/activate`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('409 - attempt to activate a place that was already activated', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(), // ! already activated
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/activate`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(409);
    });
  });

  describe('POST /place/:idx/deactivate', () => {
    it('200 - confirms place is deactivated successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/deactivate`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);
    });

    it('401 - no access token provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/deactivate`)
        .expect(401);
    });

    it('400 - attempt to deactivate a place with invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx'; // ! invalid place idx

      await testHelper
        .test()
        .post(`/place/${invalidPlaceIdx}/deactivate`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('404 - attempt to deactivate a place that does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = -1; // ! no place with this idx

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/deactivate`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('409 - attempt to deactivate a place that is not activated', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: null, // ! not activated
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/deactivate`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(409);
    });
  });

  describe('POST /place/:idx/close-permanently', () => {
    it('200 - confirms place is closed permanently successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/close-permanently`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const place = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: placeSeed.idx },
      });

      expect(place.permanentlyClosedAt).not.toBeNull();
    });

    it('400 - attempt to close permanently a place with invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx'; // ! invalid place idx

      await testHelper
        .test()
        .post(`/place/${invalidPlaceIdx}/close-permanently`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('401 - no access token provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/close-permanently`)
        .expect(401);
    });

    it('404 - attempt to close permanently a place that does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = -1; // ! no place with this idx

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/close-permanently`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('409 - attempt to close permanently a place that was already closed permanently', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: new Date(), // ! already closed permanently
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/close-permanently`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(409);
    });
  });

  describe('POST /place/:idx/cancel-close-permanently', () => {
    it('200 - confirms place is closed successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/cancel-close-permanently`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);

      const place = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: placeSeed.idx },
      });

      expect(place.permanentlyClosedAt).toBeNull();
    });

    it('400 - attempt to close a place with invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx'; // ! invalid place idx

      await testHelper
        .test()
        .post(`/place/${invalidPlaceIdx}/cancel-close-permanently`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('401 - no access token provided', async () => {
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/cancel-close-permanently`)
        .expect(401);
    });

    it('404 - attempt to close a place that does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = -1; // ! no place with this idx

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/cancel-close-permanently`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('409 - attempt to close a place that was already closed', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: null, // ! not closed permanently
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/cancel-close-permanently`)
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(409);
    });
  });
});
