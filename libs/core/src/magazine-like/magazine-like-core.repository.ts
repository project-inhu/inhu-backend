import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_MAGAZINE_LIKE,
  SelectMagazineLike,
} from './model/prisma-type/select-magazine-like';

@Injectable()
export class MagazineLikeCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectMagazineLikeByIdx(
    userIdx: number,
    magazineIdx: number,
  ): Promise<SelectMagazineLike | null> {
    return await this.txHost.tx.magazineLike.findUnique({
      ...SELECT_MAGAZINE_LIKE,
      where: {
        magazineIdx_userIdx: {
          magazineIdx,
          userIdx,
        },
      },
    });
  }

  public async selectMagazineLikeAllByUserIdx(
    userIdx: number,
  ): Promise<SelectMagazineLike[]> {
    return await this.txHost.tx.magazineLike.findMany({
      ...SELECT_MAGAZINE_LIKE,
      where: {
        magazine: { deletedAt: null },
        userIdx,
      },
    });
  }

  @Transactional()
  public async insertMagazineLikeByIdx(
    magazineIdx: number,
    userIdx: number,
  ): Promise<SelectMagazineLike> {
    const magazineLike = await this.txHost.tx.magazineLike.create({
      ...SELECT_MAGAZINE_LIKE,
      data: {
        magazineIdx,
        userIdx,
      },
    });

    await this.txHost.tx.magazine.update({
      where: { idx: magazineIdx },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    return magazineLike;
  }

  @Transactional()
  public async deleteMagazineLikeByIdx(
    magazineIdx: number,
    userIdx: number,
  ): Promise<void> {
    await this.txHost.tx.magazineLike.delete({
      where: {
        magazineIdx_userIdx: {
          magazineIdx,
          userIdx,
        },
      },
    });

    await this.txHost.tx.magazine.update({
      where: { idx: magazineIdx },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    });
  }
}
