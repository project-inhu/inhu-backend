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
  'addressName',
  'detailAddress',
  'reviewCount',
  'keywordList',
  'bookmark',
  'imagePathList',
  'typeList',
]) {
  constructor(data: PlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntityFromPrisma(
    place: PlaceOverviewSelectField,
  ): PlaceOverviewEntity {
    const roadAddr = place.roadAddress;
    return new PlaceOverviewEntity({
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
      typeList: place.placeTypeMappingList.map(({ placeType }) => ({
        idx: placeType.idx,
        content: placeType.content,
      })),
    });
  }
}
