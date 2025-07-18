import { PlaceOperatingHourModel } from '@app/core';

export class PlaceOperatingHourEntity {
  /**
   * 운영 시간 인덱스
   *
   * @example 2
   */
  public idx: number;

  /**
   * 운영 시작 시간
   */
  public startAt: Date;

  /**
   * 운영 종료 시간
   */
  public endAt: Date;

  constructor(data: PlaceOperatingHourEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceOperatingHourModel) {
    return new PlaceOperatingHourEntity({
      idx: model.idx,
      startAt: model.startAt,
      endAt: model.endAt,
    });
  }
}
