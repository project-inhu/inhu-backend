import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_MAGAZINE,
  SelectMagazine,
} from './model/prisma-type/select-magazine';
import { Prisma } from '@prisma/client';
import { CreateMagazineInput } from './inputs/create-magazine.input';
import { GetAllMagazineInput } from './inputs/get-all-magazine.input';
import {
  SELECT_MAGAZINE_OVERVIEW,
  SelectMagazineOverview,
} from './model/prisma-type/select-magazine-overview';
import { UpdateMagazineInput } from './inputs/update-magazine.input';
import {
  SELECT_LIKED_MAGAZINE_OVERVIEW,
  SelectLikedMagazineOverview,
} from './model/prisma-type/select-liked-magazine-overview';
import { GetAllLikedMagazineInput } from './inputs/get-all-liked-magazine.input';

@Injectable()
export class MagazineCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectMagazineByIdx(
    idx: number,
  ): Promise<SelectMagazine | null> {
    return await this.txHost.tx.magazine.findUnique({
      ...SELECT_MAGAZINE,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectMagazineAll(
    input: GetAllMagazineInput,
  ): Promise<SelectMagazineOverview[]> {
    return await this.txHost.tx.magazine.findMany({
      ...SELECT_MAGAZINE_OVERVIEW,
      where: {
        AND: [
          { deletedAt: null },
          this.getActivatedAtFilterWhereClause(input.activated),
          this.getPinnedAtFilterWhereClause(input.pinned),
        ],
      },
      orderBy: this.getOrderByClause(input),
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectLikedMagazineAllByUserIdx(
    input: GetAllLikedMagazineInput,
  ): Promise<SelectLikedMagazineOverview[]> {
    return await this.txHost.tx.magazineLike.findMany({
      ...SELECT_LIKED_MAGAZINE_OVERVIEW,
      where: {
        userIdx: input.userIdx,
        magazine: {
          AND: [
            { deletedAt: null },
            this.getActivatedAtFilterWhereClause(input.activated),
          ],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectMagazineCount(
    input: GetAllMagazineInput,
  ): Promise<number> {
    return await this.txHost.tx.magazine.count({
      where: {
        AND: [
          { deletedAt: null },
          this.getActivatedAtFilterWhereClause(input.activated),
        ],
      },
    });
  }

  public async insertMagazine(
    input: CreateMagazineInput,
  ): Promise<SelectMagazine> {
    return await this.txHost.tx.magazine.create({
      ...SELECT_MAGAZINE,
      data: {
        title: input.title,
        description: input.description,
        content: input.content,
        thumbnailImagePath: input.thumbnailImagePath,
        isTitleVisible: input.isTitleVisible,
        placeList: input.placeIdxList
          ? {
              createMany: {
                data: input.placeIdxList.map((placeIdx) => ({
                  placeIdx,
                })),
              },
            }
          : undefined,
      },
    });
  }

  public async updateMagazineByIdx(
    idx: number,
    input: UpdateMagazineInput,
  ): Promise<void> {
    await this.txHost.tx.magazine.update({
      where: { idx, deletedAt: null },
      data: {
        title: input.title,
        description: input.description,
        content: input.content,
        thumbnailImagePath: input.thumbnailImagePath,
        isTitleVisible: input.isTitleVisible,
        activatedAt: input.activate ? new Date() : null,
        placeList: input.placeIdxList
          ? {
              deleteMany: {},
              createMany: {
                data: input.placeIdxList.map((placeIdx) => ({
                  placeIdx,
                })),
              },
            }
          : undefined,
      },
    });
  }

  public async softDeleteMagazineByIdx(idx: number): Promise<void> {
    await this.txHost.tx.magazine.update({
      data: { deletedAt: new Date() },
      where: { idx },
    });
  }

  public async increaseMagazineLikeCount(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.magazine.update({
      data: {
        likeCount: { increment: count },
      },
      where: { idx, deletedAt: null },
    });
  }

  public async decreaseMagazineLikeCount(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.magazine.update({
      data: {
        likeCount: { decrement: count },
      },
      where: { idx, deletedAt: null },
    });
  }

  public async increaseMagazineViewCount(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.magazine.update({
      data: {
        viewCount: { increment: count },
      },
      where: { idx, deletedAt: null },
    });
  }

  private getActivatedAtFilterWhereClause(
    activated?: boolean,
  ): Prisma.MagazineWhereInput {
    if (activated === undefined) {
      return {};
    }

    if (activated) {
      return { activatedAt: { not: null } };
    }

    return { activatedAt: null };
  }

  private getPinnedAtFilterWhereClause(
    pinned?: boolean,
  ): Prisma.MagazineWhereInput {
    if (pinned === undefined) {
      return {};
    }
    if (pinned) {
      return { pinnedMagazine: { isNot: null } };
    }
    return { pinnedMagazine: null };
  }

  private getOrderByClause({
    orderBy,
    pinned,
  }: Pick<GetAllMagazineInput, 'orderBy' | 'pinned'>):
    | Prisma.MagazineOrderByWithRelationInput
    | Prisma.MagazineOrderByWithRelationInput[] {
    const orderByMap: Record<string, Prisma.MagazineOrderByWithRelationInput> =
      {
        like: { likeCount: 'desc' },
        view: { viewCount: 'desc' },
        time: { createdAt: 'desc' },
      };

    const orderByClause = orderByMap[orderBy ?? 'time'];

    // if (pinned == undefined) {
    //   return [{ pinnedMagazine: { createdAt: 'desc' } }, orderByClause];
    // }
    return orderByClause;
  }
}
