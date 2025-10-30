import { MagazineLikeModel } from '@libs/core/magazine-like/model/magazine-like.model';

export class MagazineLikeEntity {
  public magazineIdx: number;
  public userIdx: number;
  public createdAt: Date;

  constructor(data: MagazineLikeEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: MagazineLikeModel): MagazineLikeEntity {
    return new MagazineLikeEntity({
      magazineIdx: model.magazineIdx,
      userIdx: model.userIdx,
      createdAt: model.createdAt,
    });
  }
}
