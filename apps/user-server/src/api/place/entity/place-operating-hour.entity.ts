import { PlaceOperatingHourModel } from '@libs/core/place/model/place-operating-hour.model';

export class PlaceOperatingHourEntity {
  /**
   * 운영 시간 인덱스
   *
   * @example 2
   */
  public idx: number;

  /**
   * 운영 시작 시간
   *
   * @example "09:00:00"
   */
  public startAt: string;

  /**
   * 운영 종료 시간
   *
   * @example "18:00:00"
   */
  public endAt: string;

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
