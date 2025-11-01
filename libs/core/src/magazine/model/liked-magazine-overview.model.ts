import { PickType } from '@nestjs/swagger';
import { MagazineOverviewModel } from './magazine-overview.model';
import { SelectLikedMagazineOverview } from './prisma-type/select-liked-magazine-overview';

export class LikedMagazineOverviewModel extends PickType(
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
  constructor(data: LikedMagazineOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    likedMagazine: SelectLikedMagazineOverview,
  ): LikedMagazineOverviewModel {
    return new LikedMagazineOverviewModel({
      idx: likedMagazine.magazine.idx,
      title: likedMagazine.magazine.title,
      description: likedMagazine.magazine.description,
      thumbnailImagePath: likedMagazine.magazine.thumbnailImagePath,
      isTitleVisible: likedMagazine.magazine.isTitleVisible,
      likeCount: likedMagazine.magazine.likeCount,
      viewCount: likedMagazine.magazine.viewCount,
      createdAt: likedMagazine.magazine.createdAt,
      activatedAt: likedMagazine.magazine.activatedAt,
    });
  }
}
