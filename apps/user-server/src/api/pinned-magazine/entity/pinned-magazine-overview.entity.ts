import { PinnedMagazineOverviewModel } from '@libs/core/pinned-magazine/model/pinned-magazine-overview.model';
import { PickType } from '@nestjs/swagger';
import { MagazineOverviewEntity } from '@user/api/magazine/entity/magazine-overview.entity';

export class PinnedMagazineOverviewEntity extends PickType(
  MagazineOverviewEntity,
  [
    'idx',
    'title',
    'description',
    'thumbnailImagePath',
    'isTitleVisible',
    'likeCount',
    'viewCount',
    'createdAt',
    'isLiked',
  ],
) {
  public pinnedAt: Date;

  constructor(data: PinnedMagazineOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: PinnedMagazineOverviewModel,
    isLiked: boolean,
  ): PinnedMagazineOverviewEntity {
    return new PinnedMagazineOverviewEntity({
      idx: model.idx,
      title: model.title,
      description: model.description,
      thumbnailImagePath: model.thumbnailImagePath,
      isTitleVisible: model.isTitleVisible,
      likeCount: model.likeCount,
      viewCount: model.viewCount,
      createdAt: model.createdAt,
      isLiked,
      pinnedAt: model.pinnedAt,
    });
  }
}
