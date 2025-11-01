import { MagazineOverviewModel } from '@libs/core/magazine/model/magazine-overview.model';
import { PickType } from '@nestjs/swagger';
import { SelectPinnedMagazineOverview } from './prisma-type/select-pinned-magazine-overview';

export class PinnedMagazineOverviewModel extends PickType(
  MagazineOverviewModel,
  [
    'idx',
    'title',
    'description',
    'thumbnailImagePath',
    'isTitleVisible',
    'likeCount',
    'viewCount',
    'createdAt',
    'activatedAt',
  ],
) {
  public pinnedAt: Date;

  constructor(data: PinnedMagazineOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    pinnedMagazine: SelectPinnedMagazineOverview,
  ): PinnedMagazineOverviewModel {
    return new PinnedMagazineOverviewModel({
      idx: pinnedMagazine.magazine.idx,
      title: pinnedMagazine.magazine.title,
      description: pinnedMagazine.magazine.description,
      thumbnailImagePath: pinnedMagazine.magazine.thumbnailImagePath,
      isTitleVisible: pinnedMagazine.magazine.isTitleVisible,
      likeCount: pinnedMagazine.magazine.likeCount,
      viewCount: pinnedMagazine.magazine.viewCount,
      createdAt: pinnedMagazine.magazine.createdAt,
      activatedAt: pinnedMagazine.magazine.activatedAt,
      pinnedAt: pinnedMagazine.createdAt,
    });
  }
}
