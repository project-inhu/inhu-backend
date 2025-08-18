import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { SelectPlaceClosedDay } from './prisma-type/select-place-closed-day';

/**
 * 정기 휴무 모델
 *
 * @publicApi
 */
export class PlaceClosedDayModel {
  /**
   * 정기 휴무 정보 식별자
   *
   * !주의: 장소 식별자가 아닙니다.
   */
  public idx: number;

  /**
   * 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
   */
  public day: DayOfWeek;

  /**
   * 몇 번째 주차 휴무인지
   */
  public week: number;

  constructor(data: PlaceClosedDayModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    closedDay: SelectPlaceClosedDay,
  ): PlaceClosedDayModel {
    return new PlaceClosedDayModel({
      idx: closedDay.idx,
      day: closedDay.day as DayOfWeek,
      week: closedDay.week,
    });
  }
}
