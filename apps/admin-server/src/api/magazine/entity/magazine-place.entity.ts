import { PlaceRoadAddressEntity } from '@admin/api/place/entity/place-road-address.entity';
import { MagazinePlaceModel } from '@libs/core/magazine/model/magazine-place.model';

export class MagazinePlaceEntity {
  /**
   * 장소 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 장소 이름
   *
   * @example "동아리 닭갈비"
   */
  public name: string;

  /**
   * 장소 전화번호
   *
   * @example "032-1111-2222"
   */
  public tel: string | null;

  /**
   * 도로명 주소
   */
  public roadAddress: PlaceRoadAddressEntity;

  /**
   * 특정 장소 이미지 경로 리스트
   *
   * @example ["/place/image1.jpg", "/place/image2.jpg"]
   */
  public placeImageList: string[];

  constructor(data: MagazinePlaceEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: MagazinePlaceModel): MagazinePlaceEntity {
    return new MagazinePlaceEntity({
      idx: model.idx,
      name: model.name,
      tel: model.tel,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      placeImageList: model.placeImageList,
    });
  }
}
