import { Injectable } from '@nestjs/common';
import { PlaceCronService } from './place-cron.service';
import { Cron } from '@nestjs/schedule';
import { getMode } from '@libs/common/utils/get-mode.util';

@Injectable()
export class PlaceCronSchedule {
  constructor(private readonly placeCronService: PlaceCronService) {}

  /**
   * 매일 0시/1시/2시에 다음 격주 휴무일을 넣는 API
   *
   * @author 강정연
   */
  @Cron('0 0-2 * * * ')
  public async placeCronJob() {
    if (getMode() === 'production')
      await this.placeCronService.AddNextBiWeeklyClosedDay();
  }
}
