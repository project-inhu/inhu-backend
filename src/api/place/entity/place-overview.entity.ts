import { PlaceEntity } from './place.entity';

export class PlaceOverviewEntity {
  constructor(
    data: Pick<
      PlaceEntity,
      | 'idx'
      | 'name'
      | 'address'
      | 'reviewCount'
      | 'bookmark'
      // | 'keyword'
      | 'imagePath'
    >,
  ) {
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
