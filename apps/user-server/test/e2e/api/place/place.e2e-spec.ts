import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { WeeklyCloseType } from '@libs/core/place/constants/weekly-close-type.constant';
import { BookmarkSeedHelper } from '@libs/testing/seed/bookmark/bookmark.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { GetAllPlaceOverviewResponseDto } from '@user/api/place/dto/response/get-all-place-overview-response.dto';
import { PlaceOverviewEntity } from '@user/api/place/entity/place-overview.entity';
import { PlaceEntity } from '@user/api/place/entity/place.entity';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Place E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const bookmarkSeedHelper = testHelper.seedHelper(BookmarkSeedHelper);

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

    it('200 - orderby review check', async () => {
      const [firstPlace, secondPlace, thirdPlace] =
        await placeSeedHelper.seedAll([
          {
            // 리뷰가 가장 많은 장소
            activatedAt: new Date(),
            name: 'first place with most reviews',
            reviewCount: 10,
          },
          {
            activatedAt: new Date(),
            name: 'second place with 5 reviews',
            reviewCount: 5,
          },
          {
            activatedAt: new Date(),
            name: 'third place with 8 reviews',
            reviewCount: 8,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          orderby: 'review',
          order: 'desc',
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx)).toStrictEqual([
        firstPlace.idx,
        thirdPlace.idx,
        secondPlace.idx,
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

    it('200 - weekly closed date filtering check', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [place1, place2] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 원래 오늘 영업일이지만 오늘은 특별 휴무인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          weeklyClosedDayList: [
            {
              closedDate: now.new(),
              type: WeeklyCloseType.BIWEEKLY,
            },
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 원래 오늘 영업일이고 휴무는 내일인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          weeklyClosedDayList: [
            {
              closedDate: now.dateAfter(1),
              type: WeeklyCloseType.BIWEEKLY,
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
        [place2.name].sort(),
      );
    });

    it('200 - close day filtering check', async () => {
      // ? close day: 정기 휴무일

      const now = testHelper.mockTodayTime('10:00');
      // now에 해당하는 날짜가 이번 달에 몇 번째 주인지 확인
      const nowNthOfWeek = testHelper
        .get(DateUtilService)
        .getTodayNthDayOfWeekInMonth();

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 영업중이지만, 오늘 정기 휴무일인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          closedDayList: [
            {
              day: now.day(),
              week: nowNthOfWeek,
            },
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 영업중이지만, 내일 정기 휴무일인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          closedDayList: [
            {
              day: now.dayAfter(1),
              week: nowNthOfWeek,
            },
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 영업중이지만, 다음 주에 정기 휴무인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          closedDayList: [
            {
              day: now.day(),
              week: nowNthOfWeek + 1,
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
        [place2.name, place3.name].sort(),
      );
    });

    it('200 - type filtering check', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 카페',
          type: PlaceType.CAFE,
        },
        {
          activatedAt: new Date(),
          name: 'place2: 음식점',
          type: PlaceType.RESTAURANT,
        },
        {
          activatedAt: new Date(),
          name: 'place3: 술집',
          type: PlaceType.BAR,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          type: PlaceType.CAFE,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx].sort(),
      );
    });

    it('200 - coordinate filtering check', async () => {
      const coordinate = {
        leftTopX: 123.00001,
        leftTopY: 78.00001,
        rightBottomX: 124.99999,
        rightBottomY: 76.99999,
      };

      const [place1] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 좌표 범위 내의 장소',
          roadAddress: {
            addressX: coordinate.leftTopX + 0.1,
            addressY: coordinate.rightBottomY + 0.1,
          },
        },
        {
          activatedAt: new Date(),
          name: 'place2: y좌표 위로 벗어난 장소',
          roadAddress: {
            addressX: coordinate.leftTopX + 0.1,
            addressY: coordinate.leftTopY + 0.1, // ! Y 좌표 위로 벗어남
          },
        },
        {
          activatedAt: new Date(),
          name: 'place3: x좌표 왼쪽으로 벗어난 장소',
          roadAddress: {
            addressX: coordinate.leftTopX - 0.1, // ! X 좌표 왼쪽으로 벗어남
            addressY: coordinate.rightBottomY + 0.1,
          },
        },
        {
          activatedAt: new Date(),
          name: 'place4: x좌표 오른쪽으로 벗어난 장소',
          roadAddress: {
            addressX: coordinate.rightBottomX + 0.1, // ! X 좌표 오른쪽으로 벗어남
            addressY: coordinate.rightBottomY + 0.1,
          },
        },
        {
          activatedAt: new Date(),
          name: 'place5: y좌표 아래로 벗어난 장소',
          roadAddress: {
            addressX: coordinate.leftTopX + 0.1,
            addressY: coordinate.rightBottomY - 0.1, // ! Y 좌표 아래로 벗어남
          },
        },
      ]);

      const response = await testHelper.test().get('/place/all').query({
        page: 1,
        leftTopX: coordinate.leftTopX,
        leftTopY: coordinate.leftTopY,
        rightBottomX: coordinate.rightBottomX,
        rightBottomY: coordinate.rightBottomY,
      });

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx].sort(),
      );
    });

    it('200 - bookmark filed check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
        },
        {
          activatedAt: new Date(),
        },
        {
          activatedAt: new Date(),
        },
      ]);

      await bookmarkSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          userIdx: loginUser.idx,
        },
        {
          placeIdx: place3.idx,
          userIdx: loginUser.idx,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(
        placeList
          .filter(({ bookmark }) => bookmark)
          .map(({ idx }) => idx)
          .sort(),
      ).toStrictEqual([place1.idx, place3.idx].sort());
    });

    it('200 - take querystring test', async () => {
      const placeCount = 101;

      await placeSeedHelper.seedAll(
        Array(placeCount)
          .fill(0)
          .map(() => ({ activatedAt: new Date() })),
      );

      const response = await testHelper.test().get('/place/all').query({
        page: 1,
        take: 100,
      });

      const { placeOverviewList, hasNext } =
        response.body as GetAllPlaceOverviewResponseDto;

      expect(placeOverviewList.length).toBe(100);
      expect(hasNext).toBeTruthy();
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

  describe('GET /place/bookmarked/all', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;

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

      await bookmarkSeedHelper.seed({
        placeIdx: placeSeed.idx,
        userIdx: loginUser.idx,
      });

      const response = await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
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
      expect(place.bookmark).toBe(true);
      expect(place.imagePathList.sort()).toEqual(place.imagePathList.sort());
    });

    it('400 - invalid querystring', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const invalidPage = 'invalid page parameter';

      await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({ page: invalidPage })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(400);
    });

    it('400 - invalid order parameter', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const invalidOrder = 'invalid order parameter';

      await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({
          page: 1,
          order: invalidOrder,
        })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(400);
    });

    it('401 - invalid access token', async () => {
      const invalidToken = 'invalid-access-token';

      await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });

    it('401 - no token provided', async () => {
      await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({ page: 1 })
        .expect(401);
    });
  });

  describe('GET /place/:placeIdx', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;
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
        type: PlaceType.CAFE,
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
            day: DayOfWeek.THU,
            startAt: now.new('12:00'),
            endAt: now.new('13:00'),
          },
          {
            day: DayOfWeek.THU,
            startAt: now.new('20:00'),
            endAt: now.new('21:00'),
          },
        ],
        operatingHourList: [
          {
            day: DayOfWeek.FRI,
            startAt: now.new('10:00'),
            endAt: now.new('20:00'),
          },
          {
            day: DayOfWeek.SAT,
            startAt: now.new('10:00'),
            endAt: now.new('20:00'),
          },
        ],
        weeklyClosedDayList: [
          {
            closedDate: now.new(),
            type: WeeklyCloseType.BIWEEKLY,
          },
          {
            closedDate: now.dateAfter(1),
            type: WeeklyCloseType.BIWEEKLY,
          },
        ],
        closedDayList: [
          {
            day: DayOfWeek.FRI,
            week: 1,
          },
          {
            day: DayOfWeek.SAT,
            week: 2,
          },
        ],
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
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
      expect(place.bookmark).toBe(false);
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
      expect(place.weeklyClosedDayList[0].type).toBe(WeeklyCloseType.BIWEEKLY);
      expect(place.weeklyClosedDayList[1].date).toBe(
        now.dateAfter(1).toISOString().split('T')[0],
      );
      expect(place.weeklyClosedDayList[1].type).toBe(WeeklyCloseType.BIWEEKLY);
      expect(place.closedDayList.length).toBe(2);
      expect(place.closedDayList[0].day).toBe(DayOfWeek.FRI);
      expect(place.closedDayList[0].week).toBe(1);
      expect(place.closedDayList[1].day).toBe(DayOfWeek.SAT);
      expect(place.closedDayList[1].week).toBe(2);
    });

    it('404 - place not found', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        activatedAt: null,
      });

      await testHelper
        .test()
        .get(`/place/${place.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(404);
    });

    it('404 - deleted place', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(),
      });

      const place = await testHelper.getPrisma().place.findUnique({
        where: { idx: placeSeed.idx },
      });
      console.log(place);

      await testHelper
        .test()
        .get(`/place/${placeSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(404);
    });

    it('404 - not activated place', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const nonExistentPlaceIdx = 9999;

      await testHelper
        .test()
        .get(`/place/${nonExistentPlaceIdx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(404);
    });

    it('200 - no token provided', async () => {
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper.test().get(`/place/${placeSeed.idx}`).expect(200);
    });

    it('200 - bookmark field check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await bookmarkSeedHelper.seed({
        placeIdx: placeSeed.idx,
        userIdx: loginUser.idx,
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const place: PlaceEntity = response.body;

      expect(place.bookmark).toBe(true);
    });
  });
});
