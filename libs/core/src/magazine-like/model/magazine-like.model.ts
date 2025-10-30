import { SelectMagazineLike } from './prisma-type/select-magazine-like';

export class MagazineLikeModel {
  magazineIdx: number;
  userIdx: number;
  createdAt: Date;

  constructor(data: MagazineLikeModel) {
    Object.assign(this, data);
  }

  static fromPrisma(magazineLike: SelectMagazineLike): MagazineLikeModel {
    return new MagazineLikeModel({
      magazineIdx: magazineLike.magazineIdx,
      userIdx: magazineLike.userIdx,
      createdAt: magazineLike.createdAt,
    });
  }
}
