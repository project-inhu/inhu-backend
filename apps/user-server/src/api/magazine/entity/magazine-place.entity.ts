import { MagazinePlaceModel } from '@libs/core/magazine/model/magazine-place.model';
import { PickType } from '@nestjs/swagger';
import { PlaceRoadAddressEntity } from '@user/api/place/entity/place-road-address.entity';
import { PlaceEntity } from '@user/api/place/entity/place.entity';

export class MagazinePlaceEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'tel',
  'roadAddress',
  'imagePathList',
  'bookmark',
]) {
  constructor(data: MagazinePlaceEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: MagazinePlaceModel,
    userBookmarkedPlaceList: number[],
  ): MagazinePlaceEntity {
    return new MagazinePlaceEntity({
      idx: model.idx,
      name: model.name,
      tel: model.tel,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      imagePathList: model.imgPathList,
      bookmark: userBookmarkedPlaceList.includes(model.idx),
    });
  }
}
