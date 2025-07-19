import { PlaceBreakTimeModel } from '@libs/core';

export class PlaceBreakTimeEntity {
  /**
   * 브레이크 타임 인덱스
   *
   * @example 4
   */
  public idx: number;

  /**
   * 브레이크 타임 시작 시간
   *
   * @example '2023-10-01T12:00:00.000Z'
   */
  public startAt: Date;

  /**
   * 브레이크 타임 종료 시간
   *
   * @example '2023-10-01T13:00:00.000Z'
   */
  public endAt: Date;

  constructor(data: PlaceBreakTimeEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceBreakTimeModel): PlaceBreakTimeEntity {
    return new PlaceBreakTimeEntity({
      idx: model.idx,
      startAt: model.startAt,
      endAt: model.endAt,
    });
  }
}
