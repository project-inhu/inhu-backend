import { MagazineModel } from '@libs/core/magazine/model/magazine.model';
import { PickType } from '@nestjs/swagger';
import { SelectPinnedMagazine } from './prisma-type/select-pinned-magazine';
import { MagazinePlaceModel } from '@libs/core/magazine/model/magazine-place.model';

export class PinnedMagazineModel extends PickType(MagazineModel, [
  'idx',
  'title',
  'description',
  'thumbnailImagePath',
  'content',
  'isTitleVisible',
  'likeCount',
  'viewCount',
  'createdAt',
  'activatedAt',
  'placeList',
]) {
  pinnedAt: Date;

  constructor(data: PinnedMagazineModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    pinnedMagazine: SelectPinnedMagazine,
  ): PinnedMagazineModel {
    return new PinnedMagazineModel({
      idx: pinnedMagazine.magazine.idx,
      title: pinnedMagazine.magazine.title,
      description: pinnedMagazine.magazine.description,
      thumbnailImagePath: pinnedMagazine.magazine.thumbnailImagePath,
      content: pinnedMagazine.magazine.content,
      isTitleVisible: pinnedMagazine.magazine.isTitleVisible,
      likeCount: pinnedMagazine.magazine.likeCount,
      viewCount: pinnedMagazine.magazine.viewCount,
      createdAt: pinnedMagazine.magazine.createdAt,
      activatedAt: pinnedMagazine.magazine.activatedAt,
      placeList: pinnedMagazine.magazine.placeList.map((mp) =>
        MagazinePlaceModel.fromPrisma(mp),
      ),
      pinnedAt: pinnedMagazine.createdAt,
    });
  }
}
