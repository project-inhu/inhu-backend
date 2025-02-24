import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from './place.entity';

export class PlaceOverviewEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'address',
  'reviewCount',
  'bookmark',
  'imagePath',
]) {
  constructor(data: PlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntityFromPrisma(
    place: PlaceOverviewQueryResult,
  ): PlaceOverviewEntity {
    return new PlaceOverviewEntity({
      idx: place.idx,
      name: place.name,
      address: place.address,
      reviewCount: place.review.length,
      bookmark: place.bookmark.length > 0 ? true : false,
      // keyword: [],
      imagePath: place.placeImage.map((path) => path.imagePath ?? ''),
    });
  }
}
