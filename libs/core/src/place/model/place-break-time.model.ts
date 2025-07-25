import { DayOfWeek } from '@libs/common';
import type { SelectPlaceBreakTime } from './prisma-type/select-place-break-time';

export class PlaceBreakTimeModel {
  /**
   * 휴식 시간 정보 식별자
   *
   * !주의: 장소 식별자가 아닙니다.
   */
  public idx: number;

  /**
   * 시작 시간
   *
   * @example "12:00:00"
   */
  public startAt: string;

  /**
   * 종료 시간
   *
   * @example "12:00:00"
   */
  public endAt: string;

  /**
   * 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
   */
  public day: DayOfWeek;

  constructor(data: PlaceBreakTimeModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    breakTime: SelectPlaceBreakTime,
  ): PlaceBreakTimeModel {
    return new PlaceBreakTimeModel({
      idx: breakTime.idx,
      startAt: breakTime.startAt.toISOString().split('T')[1].split('.')[0],
      endAt: breakTime.endAt.toISOString().split('T')[1].split('.')[0],
      day: breakTime.day as DayOfWeek,
    });
  }
}
