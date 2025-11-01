import { PickType } from '@nestjs/swagger';
import { MagazineModel } from './magazine.model';
import { SelectMagazineOverview } from './prisma-type/select-magazine-overview';

export class MagazineOverviewModel extends PickType(MagazineModel, [
  'idx',
  'title',
  'description',
  'thumbnailImagePath',
  'isTitleVisible',
  'likeCount',
  'viewCount',
  'createdAt',
  'activatedAt',
  'pinnedAt',
]) {
  constructor(data: MagazineOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    magazine: SelectMagazineOverview,
  ): MagazineOverviewModel {
    return new MagazineOverviewModel({
      idx: magazine.idx,
      title: magazine.title,
      description: magazine.description,
      thumbnailImagePath: magazine.thumbnailImagePath,
      isTitleVisible: magazine.isTitleVisible,
      likeCount: magazine.likeCount,
      viewCount: magazine.viewCount,
      createdAt: magazine.createdAt,
      activatedAt: magazine.activatedAt,
      pinnedAt: magazine.pinnedAt,
    });
  }
}
