import { PlaceRoadAddressEntity } from '@admin/api/place/entity/place-road-address.entity';
import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { MagazinePlaceModel } from '@libs/core/magazine/model/magazine-place.model';
import { PickType } from '@nestjs/swagger';

export class MagazinePlaceEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'tel',
  'roadAddress',
  'imagePathList',
]) {
  /**
   * 현재 사용자가 특정 항목을 북마크했는지 여부
   * - admin-server에서는 항상 false
   *
   * @example false
   */
  public bookmark: boolean;

  constructor(data: MagazinePlaceEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: MagazinePlaceModel): MagazinePlaceEntity {
    return new MagazinePlaceEntity({
      idx: model.idx,
      name: model.name,
      tel: model.tel,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      imagePathList: model.imgPathList,
      bookmark: false,
    });
  }
}
