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

  public async AddNextBiWeeklyClosedDay() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const nextClosedDate = new Date();
      nextClosedDate.setHours(0, 0, 0, 0);
      nextClosedDate.setDate(today.getDate() + 14);

      const todayKoreanDateStr =
        this.dateUtilService.transformKoreanDate(today);
      const startOfDay = new Date(`${todayKoreanDateStr}T00:00:00+09:00`);
      const endOfDay = new Date(`${todayKoreanDateStr}T23:59:59.999+09:00`);

      const nextKoreanDateStr =
        this.dateUtilService.transformKoreanDate(nextClosedDate);
      const nextStartOfDay = new Date(`${nextKoreanDateStr}T00:00:00+09:00`);
      const nextEndOfDay = new Date(`${nextKoreanDateStr}T23:59:59.999+09:00`);

      const BIWEEKLY = 0;

      const placeToUpdateList =
        await this.placeCoreService.getPlaceIdxAllByWeeklyClosedDay(
          startOfDay,
          endOfDay,
          nextStartOfDay,
          nextEndOfDay,
          BIWEEKLY,
        );

      if (placeToUpdateList.length == 0) {
        return;
      }

      for (const place of placeToUpdateList) {
        try {
          await this.placeCoreService.createWeeklyClosedDayByPlaceIdx(
            place.idx,
            nextClosedDate,
            BIWEEKLY,
          );
        } catch (error) {
          this.logger.error(
            `placeIdx : ${place.idx} - Error creating weekly closed day`,
            error,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in AddNextBiWeeklyClosedDay:', error);
    }
  }
}
