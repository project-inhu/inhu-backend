import { BatchServerModule } from '@batch/batch-server.module';
import { TestHelper } from './setup/test.helper';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { PlaceCronService } from '@batch/place-cron/place-cron.service';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';

describe('Place cron e2e', () => {
  const testHelper = TestHelper.create(BatchServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  let placeCronService: PlaceCronService;
  let placeCoreService: PlaceCoreService;
  let dateUtilService: DateUtilService;

  const TODAY_KST_STRING = '2025-08-20';

  beforeEach(async () => {
    await testHelper.init();
    placeCronService = testHelper.get<PlaceCronService>(PlaceCronService);
    placeCoreService = testHelper.get<PlaceCoreService>(PlaceCoreService);
    dateUtilService = testHelper.get<DateUtilService>(DateUtilService);
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  it('should successfully add the next biweekly closed day', async () => {
    const today = new Date(TODAY_KST_STRING);
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 14);

    const testPlace = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: today,
          type: 0,
        },
      ],
    });

    //Mocking : dateUtilService가 실제 날짜 대신, 우리가 고정한 '오늘' 날짜를 반환하도록 설정
    const mock = jest
      .spyOn(dateUtilService, 'transformKoreanDate')
      .mockReturnValue(TODAY_KST_STRING);

    await placeCronService.AddNextBiWeeklyClosedDay();

    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + 14);

    const closedDay = await testHelper.getPrisma().weeklyClosedDay.findFirst({
      where: {
        placeIdx: testPlace.idx,
        closedDate: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lte: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
      },
    });

    expect(closedDay).not.toBeNull();
    expect(closedDay?.closedDate.toISOString().split('T')[0]).toBe(
      targetDate.toISOString().split('T')[0],
    );

    mock.mockRestore();
  });

  it('should not add a closed day if no places are found', async () => {
    const today = new Date(TODAY_KST_STRING);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const testPlace = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: tomorrow,
          type: 0,
        },
      ],
    });

    const initialClosedDayCount = await testHelper
      .getPrisma()
      .weeklyClosedDay.count({
        where: { placeIdx: testPlace.idx },
      });

    const mock = jest
      .spyOn(dateUtilService, 'transformKoreanDate')
      .mockReturnValue(TODAY_KST_STRING);

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
    const today = new Date(TODAY_KST_STRING);
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 14);

    const startOfTargetDay = new Date(nextDate);
    startOfTargetDay.setHours(0, 0, 0, 0);

    const endOfTargetDay = new Date(nextDate);
    endOfTargetDay.setHours(23, 59, 59, 999);

    const testPlace1 = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: today,
          type: 0,
        },
      ],
    });

    const testPlace2 = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: today,
          type: 0,
        },
      ],
    });

    const mock = jest
      .spyOn(dateUtilService, 'transformKoreanDate')
      .mockReturnValue(TODAY_KST_STRING);

    await placeCronService.AddNextBiWeeklyClosedDay();

    const newClosedDayCount = await testHelper
      .getPrisma()
      .weeklyClosedDay.count({
        where: {
          placeIdx: { in: [testPlace1.idx, testPlace2.idx] },
          closedDate: {
            gte: startOfTargetDay,
            lte: endOfTargetDay,
          },
        },
      });

    expect(newClosedDayCount).toBe(2);

    mock.mockRestore();
  });

  it('should not create a duplicate closed day if one already exists', async () => {
    const today = new Date(TODAY_KST_STRING);
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 14);

    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + 14);

    const testPlace = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        { closedDate: today, type: 0 },
        {
          closedDate: targetDate,
          type: 0,
        },
      ],
    });

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
    const today = new Date(TODAY_KST_STRING);
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 14);

    const startOfTargetDay = new Date(nextDate);
    startOfTargetDay.setHours(0, 0, 0, 0);

    const endOfTargetDay = new Date(nextDate);
    endOfTargetDay.setHours(23, 59, 59, 999);

    const place1 = await placeSeedHelper.seed({
      weeklyClosedDayList: [{ closedDate: today, type: 0 }],
    });
    const place2 = await placeSeedHelper.seed({
      weeklyClosedDayList: [{ closedDate: today, type: 0 }],
    });

    // place1에 대한 업데이트가 실패하도록 한번만 mock
    const mockCreatedMethod = jest
      .spyOn(placeCoreService, 'createWeeklyClosedDayByPlaceIdx')
      .mockImplementationOnce(() => {
        throw new Error('Simulated error');
      });

    const mock = jest
      .spyOn(dateUtilService, 'transformKoreanDate')
      .mockReturnValue(TODAY_KST_STRING);

    await placeCronService.AddNextBiWeeklyClosedDay();

    expect(mockCreatedMethod).toHaveBeenCalledTimes(2);

    const place1ClosedDay = await testHelper
      .getPrisma()
      .weeklyClosedDay.findFirst({
        where: {
          placeIdx: place1.idx,
          closedDate: {
            gte: startOfTargetDay,
            lte: endOfTargetDay,
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
            gte: startOfTargetDay,
            lte: endOfTargetDay,
          },
        },
      });
    expect(place2ClosedDay).not.toBeNull();

    mockCreatedMethod.mockRestore();
    mock.mockRestore();
  });
});
