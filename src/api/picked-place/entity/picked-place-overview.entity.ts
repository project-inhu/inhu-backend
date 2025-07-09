import { PickedPlaceOverviewSelectField } from '../type/picked-place-overview-select-field';
import { PickedPlaceEntity } from './picked-place.entity';
import { PickType } from '@nestjs/swagger';

export class PickedPlaceOverviewEntity extends PickType(PickedPlaceEntity, [
  'title',
  'content',
  'idx',
  'name',
  'address',
  'reviewCount',
  'bookmark',
  'imagePathList',
]) {
  constructor(data: PickedPlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }
  static createEntityFromPrisma(
    data: PickedPlaceOverviewSelectField,
  ): PickedPlaceOverviewEntity {
    const place = data.place;
    return new PickedPlaceOverviewEntity({
      idx: place.idx,
      name: place.name,
      address: place.address,
      reviewCount: place.reviewCount,
      bookmark: place.bookmarkList?.length ? true : false,
      imagePathList: place.placeImageList.map((image) => image.path ?? ''),
      title: data.title,
      content: data.content,
    });
  }
}
