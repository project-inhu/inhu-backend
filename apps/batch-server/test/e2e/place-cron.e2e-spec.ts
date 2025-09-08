import { BatchServerModule } from '@batch/batch-server.module';
import { TestHelper } from './setup/test.helper';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { PlaceCronService } from '@batch/place-cron/place-cron.service';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import { WeeklyCloseType } from '@libs/core/place/constants/weekly-close-type.constant';

describe('Place cron e2e', () => {
  const testHelper = TestHelper.create(BatchServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);

  const TODAY_KST_STRING = '2025-08-20';

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  it('should successfully add the next biweekly closed day', async () => {
    const expectedNext = new Date(TODAY_KST_STRING);
    expectedNext.setDate(expectedNext.getDate() + 14);

    const testPlace = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: new Date(TODAY_KST_STRING),
          type: WeeklyCloseType.BIWEEKLY,
        },
      ],
    });

    const dateUtilService = testHelper.get<DateUtilService>(DateUtilService);

    const placeCronService = testHelper.get<PlaceCronService>(PlaceCronService);

    //Mocking : dateUtilService가 실제 날짜 대신, 우리가 고정한 '오늘' 날짜를 반환하도록 설정
    const mock = jest
      .spyOn(dateUtilService, 'getNow')
      .mockReturnValue(new Date(TODAY_KST_STRING));

    await placeCronService.AddNextBiWeeklyClosedDay();

    const closedDay = await testHelper.getPrisma().weeklyClosedDay.findFirst({
      where: {
        placeIdx: testPlace.idx,
        closedDate: {
          gte: new Date(expectedNext.setHours(0, 0, 0, 0)),
          lte: new Date(expectedNext.setHours(23, 59, 59, 999)),
        },
      },
    });

    expect(closedDay).not.toBeNull();
    expect(closedDay?.closedDate.toISOString().split('T')[0]).toBe(
      expectedNext.toISOString().split('T')[0], // yyyy-mm-dd 비교
    );

    mock.mockRestore();
  });

  it('should not add a closed day if no places are found', async () => {
    const tomorrow = new Date(TODAY_KST_STRING);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const testPlace = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: tomorrow,
          type: WeeklyCloseType.BIWEEKLY,
        },
      ],
    });

    const initialClosedDayCount = await testHelper
      .getPrisma()
      .weeklyClosedDay.count({
        where: { placeIdx: testPlace.idx },
      });

    const dateUtilService = testHelper.get<DateUtilService>(DateUtilService);

    const placeCronService = testHelper.get<PlaceCronService>(PlaceCronService);

    const mock = jest
      .spyOn(dateUtilService, 'getNow')
      .mockReturnValue(new Date(TODAY_KST_STRING));

    await placeCronService.AddNextBiWeeklyClosedDay();

    const finalClosedDayCount = await testHelper
      .getPrisma()
      .weeklyClosedDay.count({
        where: { placeIdx: testPlace.idx },
      });

    expect(finalClosedDayCount).toBe(initialClosedDayCount);

    mock.mockRestore();
  });

  it('should successfully add the next biweekly closed day for multiple places', async () => {
    const expectedNext = new Date(TODAY_KST_STRING);
    expectedNext.setDate(expectedNext.getDate() + 14);

    const testPlace1 = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: new Date(TODAY_KST_STRING),
          type: WeeklyCloseType.BIWEEKLY,
        },
      ],
    });

    const testPlace2 = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: new Date(TODAY_KST_STRING),
          type: WeeklyCloseType.BIWEEKLY,
        },
      ],
    });

    const dateUtilService = testHelper.get<DateUtilService>(DateUtilService);
    const placeCronService = testHelper.get<PlaceCronService>(PlaceCronService);

    const mock = jest
      .spyOn(dateUtilService, 'getNow')
      .mockReturnValue(new Date(TODAY_KST_STRING));

    await placeCronService.AddNextBiWeeklyClosedDay();

    const newClosedDayCount = await testHelper
      .getPrisma()
      .weeklyClosedDay.count({
        where: {
          placeIdx: { in: [testPlace1.idx, testPlace2.idx] },
          closedDate: {
            gte: new Date(expectedNext.setHours(0, 0, 0, 0)),
            lte: new Date(expectedNext.setHours(23, 59, 59, 999)),
          },
        },
      });

    expect(newClosedDayCount).toBe(2);

    mock.mockRestore();
  });

  it('should not create a duplicate closed day if one already exists', async () => {
    const expectedNext = new Date(TODAY_KST_STRING);
    expectedNext.setDate(expectedNext.getDate() + 14);

    const testPlace = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: new Date(TODAY_KST_STRING),
          type: WeeklyCloseType.BIWEEKLY,
        },
        { closedDate: expectedNext, type: WeeklyCloseType.BIWEEKLY },
      ],
    });

    const dateUtilService = testHelper.get<DateUtilService>(DateUtilService);
    const placeCronService = testHelper.get<PlaceCronService>(PlaceCronService);

    const mock = jest
      .spyOn(dateUtilService, 'transformKoreanDate')
      .mockReturnValue(TODAY_KST_STRING);

    await placeCronService.AddNextBiWeeklyClosedDay();

    const closedDayCount = await testHelper.getPrisma().weeklyClosedDay.count({
      where: {
        placeIdx: testPlace.idx,
      },
    });

    expect(closedDayCount).toBe(2);

    mock.mockRestore();
  });

  it('should continue processing other places even if one fails', async () => {
    const expectedNext = new Date(TODAY_KST_STRING);
    expectedNext.setDate(expectedNext.getDate() + 14);

    const place1 = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: new Date(TODAY_KST_STRING),
          type: WeeklyCloseType.BIWEEKLY,
        },
      ],
    });
    const place2 = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: new Date(TODAY_KST_STRING),
          type: WeeklyCloseType.BIWEEKLY,
        },
      ],
    });
    const dateUtilService = testHelper.get<DateUtilService>(DateUtilService);
    const placeCoreService = testHelper.get<PlaceCoreService>(PlaceCoreService);
    const placeCronService = testHelper.get<PlaceCronService>(PlaceCronService);

    const originalCreateMethod = placeCoreService.createWeeklyClosedDay;

    // place1에 대한 업데이트가 실패하도록 한번만 mock
    const mockCreatedMethod = jest
      .spyOn(placeCoreService, 'createWeeklyClosedDay')
      .mockImplementation(
        async (placeIdx: number, date: string, type: number) => {
          if (placeIdx === place1.idx) {
            throw new Error('Simulated error');
          }
          return originalCreateMethod.call(
            placeCoreService,
            placeIdx,
            date,
            type,
          );
        },
      );

    const mock = jest
      .spyOn(dateUtilService, 'getNow')
      .mockReturnValue(new Date(TODAY_KST_STRING));

    await placeCronService.AddNextBiWeeklyClosedDay();

    expect(mockCreatedMethod).toHaveBeenCalledTimes(2);

    const startOfDay = new Date(expectedNext);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(expectedNext);
    endOfDay.setHours(23, 59, 59, 999);

    const place1ClosedDay = await testHelper
      .getPrisma()
      .weeklyClosedDay.findFirst({
        where: {
          placeIdx: place1.idx,
          closedDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });
    expect(place1ClosedDay).toBeNull();

    const place2ClosedDay = await testHelper
      .getPrisma()
      .weeklyClosedDay.findFirst({
        where: {
          placeIdx: place2.idx,
          closedDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });
    expect(place2ClosedDay).not.toBeNull();

    mockCreatedMethod.mockRestore();
    mock.mockRestore();
  });
});
