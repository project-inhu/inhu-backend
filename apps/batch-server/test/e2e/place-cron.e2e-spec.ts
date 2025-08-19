import { BatchServerModule } from '@batch/batch-server.module';
import { TestHelper } from './setup/test.helper';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { PlaceCronService } from '@batch/place-cron/place-cron.service';

describe('Place cron e2e', () => {
  const testHelper = TestHelper.create(BatchServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  let placeCronService: PlaceCronService;

  beforeEach(async () => {
    await testHelper.init();
    placeCronService = testHelper.get<PlaceCronService>(PlaceCronService);
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  it('should successfully add the next biweekly closed day', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const testPlace = await placeSeedHelper.seed({
      weeklyClosedDayList: [
        {
          closedDate: today,
          type: 0,
        },
      ],
    });

    await placeCronService.AddNextBiWeeklyClosedDay();

    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + 14);

    const closedDay = await testHelper.getPrisma().weeklyClosedDay.findFirst({
      where: {
        placeIdx: testPlace.idx,
        closedDate: targetDate,
      },
    });

    expect(closedDay).not.toBeNull();
    expect(closedDay?.closedDate.toISOString().split('T')[0]).toBe(
      targetDate.toISOString().split('T')[0],
    );
  });
});
