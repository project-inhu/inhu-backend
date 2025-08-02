import { PlaceRoadAddressModel } from '@libs/core/place/model/place-road-address.model';
import { IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class PlaceRoadAddressEntity {
  /**
   * 주소명
   *
   * @example "인천광역시 연수구 송도동 1-1"
   */
  @IsString()
  @Max(40)
  public name: string;

  /**
   * 자세한 주소
   *
   * @example "2층"
   */
  @IsString()
  @Max(30)
  @IsOptional()
  public detail: string | null = null;

  /**
   * 주소 X 좌표
   *
   * @example 37.123456
   */
  @IsNumber()
  public addressX: number;

  /**
   * 주소 Y 좌표
   *
   * @example 126.123456
   */
  @IsNumber()
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
