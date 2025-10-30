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
        ],
      },
      orderBy: this.getOrderByClause(input),
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
    activate: boolean,
  ): Promise<void> {
    await this.txHost.tx.magazine.update({
      where: { idx },
      data: { activatedAt: activate ? new Date() : null },
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

  private getOrderByClause({
    orderBy,
  }: Pick<
    GetAllMagazineInput,
    'orderBy'
  >): Prisma.MagazineOrderByWithRelationInput {
    if (orderBy === 'like') {
      return { likeCount: 'desc' };
    } else if (orderBy === 'view') {
      return { viewCount: 'desc' };
    } else if (orderBy === 'time') {
      return { createdAt: 'desc' };
    } else {
      return { createdAt: 'desc' };
    }
  }
}
