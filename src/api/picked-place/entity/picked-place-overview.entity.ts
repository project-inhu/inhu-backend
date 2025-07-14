import { PickedPlaceOverviewSelectField } from '../type/picked-place-overview-select-field';
import { PickedPlaceEntity } from './picked-place.entity';
import { PickType } from '@nestjs/swagger';

/**
 * pickedPlace overview entity
 *
 * @author 강정연
 */
export class PickedPlaceOverviewEntity extends PickType(PickedPlaceEntity, [
  'title',
  'content',
  'idx',
  'name',
  'addressName',
  'detailAddress',
  'reviewCount',
  'keywordList',
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
    const roadAddr = place.roadAddress;

    return new PickedPlaceOverviewEntity({
      title: data.title,
      content: data.content,
      idx: place.idx,
      name: place.name,
      addressName: roadAddr.addressName,
      detailAddress: roadAddr.detailAddress,
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
