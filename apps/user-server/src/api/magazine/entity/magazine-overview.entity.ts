import { PickType } from '@nestjs/swagger';
import { MagazineEntity } from './magazine.entity';
import { MagazineOverviewModel } from '@libs/core/magazine/model/magazine-overview.model';

export class MagazineOverviewEntity extends PickType(MagazineEntity, [
  'idx',
  'title',
  'description',
  'thumbnailImagePath',
  'isTitleVisible',
  'createdAt',
  'activatedAt',
]) {
  constructor(data: MagazineOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: MagazineOverviewModel,
  ): MagazineOverviewEntity {
    return new MagazineOverviewEntity({
      idx: model.idx,
      title: model.title,
      description: model.description,
      thumbnailImagePath: model.thumbnailImagePath,
      isTitleVisible: model.isTitleVisible,
      createdAt: model.createdAt,
      activatedAt: model.activatedAt,
    });
  }
}
