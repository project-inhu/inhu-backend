import { PinnedMagazineModel } from '@libs/core/pinned-magazine/model/pinned-magazine.model';
import { PickType } from '@nestjs/swagger';
import { MagazinePlaceEntity } from '@user/api/magazine/entity/magazine-place.entity';
import { MagazineEntity } from '@user/api/magazine/entity/magazine.entity';

export class PinnedMagazineEntity extends PickType(MagazineEntity, [
  'idx',
  'title',
  'description',
  'thumbnailImagePath',
  'content',
  'isTitleVisible',
  'likeCount',
  'viewCount',
  'createdAt',
  'placeList',
  'isLiked',
]) {
  public pinnedAt: Date;

  constructor(data: PinnedMagazineEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: PinnedMagazineModel,
    userBookmarkedPlaceList: number[],
    isLiked: boolean,
  ): PinnedMagazineEntity {
    return new PinnedMagazineEntity({
      idx: model.idx,
      title: model.title,
      description: model.description,
      thumbnailImagePath: model.thumbnailImagePath,
      content: model.content,
      isTitleVisible: model.isTitleVisible,
      likeCount: model.likeCount,
      viewCount: model.viewCount,
      createdAt: model.createdAt,
      placeList: model.placeList.map((model) =>
        MagazinePlaceEntity.fromModel(model, userBookmarkedPlaceList),
      ),
      isLiked,
      pinnedAt: model.pinnedAt,
    });
  }
}
