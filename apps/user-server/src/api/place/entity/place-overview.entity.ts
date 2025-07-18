import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from './place.entity';

export class PlaceOverviewEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'reviewCount',
  'topKeywordList',
  'bookmark',
  'imagePathList',
  'type',
]) {
  constructor(data: PlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }
}
