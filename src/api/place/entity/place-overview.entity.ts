import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from './place.entity';
import { PlaceOverviewSelectField } from '../type/place-overview-select-field.type';

export class PlaceOverviewEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'address',
  'reviewCount',
  'bookmark',
  'imagePathList',
]) {
  constructor(data: PlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntityFromPrisma(
    place: PlaceOverviewSelectField,
  ): PlaceOverviewEntity {
    return new PlaceOverviewEntity({
      idx: place.idx,
      name: place.name,
      address: place.address,
      reviewCount: place.reviewCount,
      bookmark: place.bookmark?.length ? true : false,
      imagePathList: place.placeImage.map((image) => image.path ?? ''),
    });
  }
}
