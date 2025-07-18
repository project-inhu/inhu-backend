import { PickType } from '@nestjs/swagger';
import { PlaceModel } from './place.model';
import { SelectPlaceOverview } from './prisma-type/select-place-overview';

export class PlaceOverviewModel extends PickType(PlaceModel, [
  'idx',
  'name',
  'tel',
  'reviewCount',
  'bookmarkCount',
  'isClosedOnHoliday',
  'createdAt',
  'permanentlyClosedAt',
  'imgPathList',
  'activatedAt',
]) {
  constructor(data: PlaceOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectPlaceOverview): PlaceOverviewModel {
    return new PlaceOverviewModel({
      idx: place.idx,
      name: place.name,
      tel: place.tel,
      reviewCount: place.reviewCount,
      bookmarkCount: place.bookmarkCount,
      isClosedOnHoliday: place.isClosedOnHoliday,
      createdAt: place.createdAt,
      activatedAt: place.activatedAt,
      permanentlyClosedAt: place.permanentlyClosedAt,
      imgPathList: place.placeImageList.map((image) => image.path),
    });
  }
}
