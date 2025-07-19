import { DayOfWeek } from '@libs/common';
import { SelectPlaceOperatingHour } from './prisma-type/select-place-operating-hour';

/**
 * 운영 시간 정보
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
   */
  public startAt: Date;

  /**
   * 종료 시간
   */
  public endAt: Date;

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
      startAt: hour.startAt,
      endAt: hour.endAt,
      day: hour.day as DayOfWeek,
    });
  }
}
