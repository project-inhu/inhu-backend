import { MagazinePlaceEntity } from '@admin/api/magazine/entity/magazine-place.entity';
import { MagazineEntity } from '@admin/api/magazine/entity/magazine.entity';
import { PinnedMagazineModel } from '@libs/core/pinned-magazine/model/pinned-magazine.model';
import { PickType } from '@nestjs/swagger';

export class PinnedMagazineEntity extends PickType(MagazineEntity, [
  'idx',
  'title',
  'description',
  'content',
  'thumbnailImagePath',
  'isTitleVisible',
  'likeCount',
  'viewCount',
  'createdAt',
  'activatedAt',
  'placeList',
]) {
  public pinnedAt: Date | null;

  constructor(data: PinnedMagazineEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: PinnedMagazineModel): PinnedMagazineEntity {
    return new PinnedMagazineEntity({
      idx: model.idx,
      title: model.title,
      description: model.description,
      content: model.content,
      thumbnailImagePath: model.thumbnailImagePath,
      isTitleVisible: model.isTitleVisible,
      likeCount: model.likeCount,
      viewCount: model.viewCount,
      createdAt: model.createdAt,
      activatedAt: model.activatedAt,
      placeList: model.placeList.map((mp) => MagazinePlaceEntity.fromModel(mp)),
      pinnedAt: model.pinnedAt,
    });
  }
}
