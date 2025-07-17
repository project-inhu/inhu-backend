import { DayOfWeek } from '@app/common';

export class PlaceBreakTimeModel {
  /**
   * 휴식 시간 정보 식별자
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
   * 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
   */
  public day: DayOfWeek;

  constructor(data: PlaceBreakTimeModel) {
    Object.assign(this, data);
  }
}
