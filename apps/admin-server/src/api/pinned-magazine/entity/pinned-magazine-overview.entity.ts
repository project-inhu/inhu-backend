import { MagazineOverviewEntity } from '@admin/api/magazine/entity/magazine-overview.entity';
import { PinnedMagazineOverviewModel } from '@libs/core/pinned-magazine/model/pinned-magazine-overview.model';
import { PickType } from '@nestjs/swagger';

export class PinnedMagazineOverviewEntity extends PickType(
  MagazineOverviewEntity,
  ['idx', 'title', 'thumbnailImagePath', 'createdAt', 'activatedAt'],
) {
  public pinnedAt: Date | null;

  constructor(data: PinnedMagazineOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: PinnedMagazineOverviewModel,
  ): PinnedMagazineOverviewEntity {
    return new PinnedMagazineOverviewEntity({
      idx: model.idx,
      title: model.title,
      thumbnailImagePath: model.thumbnailImagePath,
      createdAt: model.createdAt,
      activatedAt: model.activatedAt,
      pinnedAt: model.pinnedAt,
    });
  }
}
