import { PlaceRoadAddressModel } from '@app/core';

export class PlaceRoadAddressEntity {
  /**
   * 주소명
   *
   * @example "인천광역시 연수구 송도동 1-1"
   */
  public name: string;

  /**
   * 자세한 주소
   *
   * @example "2층"
   */
  public detail: string | null;

  /**
   * 주소 X 좌표
   *
   * @example 37.123456
   */
  public addressX: number;

  /**
   * 주소 Y 좌표
   *
   * @example 126.123456
   */
  public addressY: number;

  constructor(data: PlaceRoadAddressEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceRoadAddressModel,
  ): PlaceRoadAddressEntity {
    return new PlaceRoadAddressEntity({
      name: model.name,
      detail: model.detail,
      addressX: model.addressX,
      addressY: model.addressY,
    });
  }
}
