import { AdminServerModule } from '@admin/admin-server.module';
import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { dayOfWeeks } from '@libs/common';
import { PLACE_TYPE, WEEKLY_CLOSE_TYPE } from '@libs/core';
import { PlaceSeedHelper } from '@libs/testing';
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
      expect(place.breakTimeList[0].startAt).toBe('12:00:00.000');
      expect(place.breakTimeList[0].endAt).toBe('13:00:00.000');
      expect(place.breakTimeList[1].startAt).toBe('20:00:00.000');
      expect(place.breakTimeList[1].endAt).toBe('21:00:00.000');
      expect(place.operatingHourList.length).toBe(2);
      expect(place.operatingHourList[0].startAt).toBe('10:00:00.000');
      expect(place.operatingHourList[0].endAt).toBe('20:00:00.000');
      expect(place.operatingHourList[1].startAt).toBe('10:00:00.000');
      expect(place.operatingHourList[1].endAt).toBe('20:00:00.000');
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
});
