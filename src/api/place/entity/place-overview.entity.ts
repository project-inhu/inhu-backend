import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from './place.entity';
import { PlaceOverviewSelectField } from '../type/place-overview-select-field.type';

/**
 * place overview entity
 *
 * @author 강정연
 */
export class PlaceOverviewEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'address',
  'reviewCount',
  'keywordList',
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
      keywordList: place.placeKeywordCountList.map(({ keyword }) => ({
        idx: keyword.idx,
        content: keyword.content,
      })),
      bookmark: place.bookmarkList?.length ? true : false,
      imagePathList: place.placeImageList.map((image) => image.path ?? ''),
    });
  }
}
