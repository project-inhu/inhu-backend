import { PlaceWeeklyClosedDayModel, WeeklyCloseType } from '@libs/core';

export class PlaceWeeklyClosedDayEntity {
  /**
   * 주간 휴무일 인덱스
   *
   * @example 1
   */
  public idx: number;

  /**
   * 휴무 날짜
   *
   * @example '2023-10-01T00:00:00.000Z'
   */
  public date: Date;

  /**
   * 휴무 타입
   *
   * @example 0
   */
  public type: WeeklyCloseType;

  constructor(data: PlaceWeeklyClosedDayModel) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceWeeklyClosedDayModel,
  ): PlaceWeeklyClosedDayEntity {
    return new PlaceWeeklyClosedDayEntity({
      idx: model.idx,
      date: model.date,
      type: model.type,
    });
  }
}
