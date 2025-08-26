import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PlaceCronService {
  constructor(
    private readonly placeCoreService: PlaceCoreService,
    private readonly dateUtilService: DateUtilService,
    private readonly logger: Logger,
  ) {}

  /**
   * 격주 휴무일 장소에 대해 14일 뒤 다음 휴무일을 추가
   *
   * @author 강정연
   */
  public async AddNextBiWeeklyClosedDay() {
    const now = this.dateUtilService.getNow();
    const todayKSTStr = this.dateUtilService.transformKoreanDate(now);

    return this.placeCoreService.createAllWeeklyClosedDay(
      new Date(todayKSTStr),
    );
  }
}
