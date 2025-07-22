import { DateUtilService } from '@libs/common';
import { PlaceCoreService } from '@libs/core';
import { PlaceSeedHelper } from '@libs/testing';
import { DateUtil } from '@libs/testing';
import { PlaceOverviewEntity } from '@user/api/place/entity/place-overview.entity';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Place E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /place/all', () => {
    it('200 - field check', async () => {
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        roadAddress: {
          name: 'Test Road',
          detail: 'Test Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        reviewCount: 5,
        placeImgList: ['/place/test-image1.png', '/place/test-image2.png'],
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
      });

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({ page: 1 })
        .expect(200);

      const hasNext: boolean = response.body.hasNext;
      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(hasNext).toBe(false);
      expect(Array.isArray(placeList)).toBe(true);

      const place = placeList[0];

      expect(place.idx).toBe(placeSeed.idx);
      expect(place.name).toBe(placeSeed.name);
      expect(place.roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(placeSeed.roadAddress.addressX);
      expect(place.roadAddress.addressY).toBe(placeSeed.roadAddress.addressY);
      expect(place.reviewCount).toBe(placeSeed.reviewCount);
      expect(place.topKeywordList.map(({ idx }) => idx)).toStrictEqual([2, 1]);
      expect(place.bookmark).toBe(false);
      expect(place.imagePathList.sort()).toEqual(place.imagePathList.sort());
      expect(place.type).toBe(placeSeed.type);
    });

    it('200 - orderby time check', async () => {
      const [firstPlace, secondPlace, thirdPlace] =
        await placeSeedHelper.seedAll([
          {
            // 가장 먼저 생성된 장소
            name: 'first created place',
            activatedAt: new Date(),
          },
          {
            name: 'second created place',
            activatedAt: new Date(),
          },
          {
            // 가장 나중에 생성된 장소
            name: 'third created place',
            activatedAt: new Date(),
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          orderby: 'time',
          order: 'asc',
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx)).toStrictEqual([
        firstPlace.idx,
        secondPlace.idx,
        thirdPlace.idx,
      ]);
    });

    it('200 - operating filtering check', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [place1, place2, place3, place4, place5] =
        await placeSeedHelper.seedAll([
          {
            // place1:
            name: '오늘 시간에 운영 중인 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.day(),
                startAt: now.before('4h'),
                endAt: now.after('1h'),
              },
            ],
          },
          {
            // place2
            name: '내일 시간에 운영 중인 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.dayAfter(1),
                startAt: now.after('1h'),
                endAt: now.after('2h'),
              },
            ],
          },
          {
            // place3
            name: '운영 정보가 없는 가게',
            activatedAt: new Date(),
          },
          {
            // place4
            name: '오늘 운영하지만 앞으로 두 시간 뒤에 운영할 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.day(),
                startAt: now.after('2h'),
                endAt: now.after('4h'),
              },
            ],
          },
          {
            // place5
            name: '오늘 지금 시간에 운영하되 오늘 운영 정보가 하나 더 있는 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.day(),
                startAt: now.before('1h'),
                endAt: now.after('2h'),
              },
              {
                day: now.day(),
                startAt: now.before('2h'),
                endAt: now.before('1h'),
              },
            ],
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          operating: true,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place1.name, place5.name].sort(),
      );
    });

    it('200 - break time filtering check', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [place1, place2, place3, place4] = await placeSeedHelper.seedAll([
        {
          // place1
          name: '1 오늘 시간에 운영 중이면서 브레이크 타임인 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('5h'),
              endAt: now.after('2h'),
            },
          ],
        },
        {
          // place2
          name: '2 오늘 시간에 운영 중이지만 휴식 정보가 없는 가게',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('5h'),
              endAt: now.after('2h'),
            },
          ],
        },
        {
          // place3
          name: '3 오늘 시간에 운영 중이지만 휴식 시간이 다른 날에 있는 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.dayAfter(1),
              startAt: now.after('1h'),
              endAt: now.after('2h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('5h'),
              endAt: now.after('2h'),
            },
          ],
        },
        {
          // place4
          name: '4 현재 시간에 운영 중이고 브레이크 타임이 다른 시간인 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.dayAfter(1),
              startAt: now.after('1h'),
              endAt: now.after('2h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('2h'),
              endAt: now.after('3h'),
            },
          ],
        },
        {
          // place5
          name: '5 오늘 시간에 운영 중이고 브레이크 타임이 두 개지만 하나만 현재 시간에 브레이크 타임인 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.day(),
              startAt: now.before('1h'),
              endAt: now.after('2h'),
            },
            {
              day: now.day(),
              startAt: now.before('3h'),
              endAt: now.before('2h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('2h'),
              endAt: now.after('1h'),
            },
          ],
        },
      ]);

      console.log(
        await testHelper.get(PlaceCoreService).getPlaceByIdx(place1.idx),
      );

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          operating: true,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place2.name, place3.name, place4.name].sort(),
      );
    });

    it('400 - invalid page parameter', async () => {
      const invalidPage = 'invalid page parameter';

      await testHelper
        .test()
        .get('/place/all')
        .query({
          page: invalidPage,
        })
        .expect(400);
    });
  });
});
