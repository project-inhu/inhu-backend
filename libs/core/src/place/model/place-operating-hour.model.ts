import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { SelectPlaceOperatingHour } from './prisma-type/select-place-operating-hour';

/**
 * 운영 시간 정보
 *
 * @publicApi
 */
export class PlaceOperatingHourModel {
  /**
   * 운영 정보 시간 식별자
   *
   * !주의: 장소 식별자가 아닙니다.
   */
  public idx: number;

  /**
   * 시작 시간
   *
   * @example "09:00:00"
   */
  public startAt: string;

  /**
   * 종료 시간
   *
   * @example "09:00:00"
   */
  public endAt: string;

  /**
   * 요일
   */
  public day: DayOfWeek; // 0: 일요일, 1: 월요일, ..., 6: 토요일

  constructor(data: PlaceOperatingHourModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    hour: SelectPlaceOperatingHour,
  ): PlaceOperatingHourModel {
    return new PlaceOperatingHourModel({
      idx: hour.idx,
      startAt: hour.startAt.toISOString().split('T')[1].split('.')[0],
      endAt: hour.endAt.toISOString().split('T')[1].split('.')[0],
      day: hour.day as DayOfWeek,
    });
  }
}
