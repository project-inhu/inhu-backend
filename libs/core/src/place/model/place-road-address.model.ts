import { SelectPlaceRoadAddress } from './prisma-type/select-place-road-address';

export class PlaceRoadAddressModel {
  /**
   * 도로명 주소 식별자
   */
  public idx: number;

  /**
   * 주소명
   */
  public name: string;

  /**
   * 자세한 주소 내용
   */
  public detail: string | null;

  /**
   * x좌표
   */
  public addressX: number;

  /**
   * y좌표
   */
  public addressY: number;

  constructor(data: PlaceRoadAddressModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    roadAddress: SelectPlaceRoadAddress,
  ): PlaceRoadAddressModel {
    return new PlaceRoadAddressModel({
      idx: roadAddress.idx,
      name: roadAddress.addressName,
      detail: roadAddress.detailAddress,
      addressX: roadAddress.addressX.toNumber(), // TODO: Check if conversion is necessary
      addressY: roadAddress.addressY.toNumber(),
    });
  }
}
