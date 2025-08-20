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
    try {
      const BIWEEKLY = 0;

      // "한국 기준 오늘 날짜"를 가져옴
      const now = this.dateUtilService.getNow();
      const todayKSTStr = this.dateUtilService.transformKoreanDate(now);

      // 오늘 날짜의 시작(00:00:00)과 끝(23:59:59)을 나타내는 Date 객체를 생성함
      const startOfDay = new Date(todayKSTStr);
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      // 14일 뒤 날짜의 시작과 끝을 계산함
      const nextStartOfDay = new Date(startOfDay);
      nextStartOfDay.setDate(nextStartOfDay.getDate() + 14);
      const nextEndOfDay = new Date(nextStartOfDay);
      nextEndOfDay.setHours(23, 59, 59, 999);

      // "오늘이 격주 휴무일"이지만 "14일 뒤에는 휴무일이 아직 없는" 장소 목록을 DB에서 조회
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
          // 14일 뒤 휴무 날짜를 계산함
          const nextClosedDate = new Date(startOfDay);
          nextClosedDate.setDate(nextClosedDate.getDate() + 14);

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
