import { SelectPlaceWeeklyClosedDay } from './prisma-type/select-place-weekly-closed-day';
import { WeeklyCloseType } from '../constants/weekly-close-type.constant';

/**
 * 주간 휴무 모델
 *
 * @publicApi
 */
export class PlaceWeeklyClosedDayModel {
  /**
   * 운영 시간 식별자
   *
   * !주의: 장소 식별자가 아닙니다.
   */
  public idx: number;

  /**
   * 운영하지 않는 날짜
   *
   * @example "2025-07-24"
   */
  public date: string;

  /**
   * 휴무 타입
   */
  public type: WeeklyCloseType;

  constructor(data: PlaceWeeklyClosedDayModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    weeklyClosedDay: SelectPlaceWeeklyClosedDay,
  ): PlaceWeeklyClosedDayModel {
    return new PlaceWeeklyClosedDayModel({
      idx: weeklyClosedDay.idx,
      date: weeklyClosedDay.closedDate.toISOString().split('T')[0],
      type: weeklyClosedDay.type as WeeklyCloseType,
    });
  }
}
