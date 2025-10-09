import { PlaceRoadAddressModel } from '@libs/core/place/model/place-road-address.model';
import { SelectMagazinePlace } from './prisma-type/select-magazine-place';
import { PickType } from '@nestjs/swagger';
import { PlaceModel } from '@libs/core/place/model/place.model';

export class MagazinePlaceModel extends PickType(PlaceModel, [
  'idx',
  'name',
  'tel',
  'roadAddress',
  'imgPathList',
]) {
  constructor(data: MagazinePlaceModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    magazinePlace: SelectMagazinePlace,
  ): MagazinePlaceModel {
    return new MagazinePlaceModel({
      idx: magazinePlace.place.idx,
      name: magazinePlace.place.name,
      tel: magazinePlace.place.tel,
      roadAddress: PlaceRoadAddressModel.fromPrisma(
        magazinePlace.place.roadAddress,
      ),
      imgPathList: magazinePlace.place.placeImageList.map(({ path }) => path),
    });
  }
}
