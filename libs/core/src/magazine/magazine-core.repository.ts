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
import { GetAllMagazineOverviewInput } from './inputs/get-all-magazine-overview.input';

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
        activatedAt: { not: null },
        deletedAt: null,
      },
    });
  }

  public async selectMagazineAll(
    input: GetAllMagazineInput,
  ): Promise<SelectMagazine[]> {
    return await this.txHost.tx.magazine.findMany({
      ...SELECT_MAGAZINE,
      where: {
        AND: [
          { deletedAt: null },
          this.getActivatedAtFilterWhereClause(input.activated),
        ],
      },
      orderBy: {
        activatedAt: 'desc',
      },
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectMagazineOverviewAll(
    input: GetAllMagazineOverviewInput,
  ): Promise<SelectMagazineOverview[]> {
    return await this.txHost.tx.magazine.findMany({
      ...SELECT_MAGAZINE_OVERVIEW,
      where: {
        AND: [{ deletedAt: null }, this.getActivatedAtFilterWhereClause(true)],
      },
      orderBy: {
        activatedAt: 'desc',
      },
      take: input.take,
      skip: input.skip,
    });
  }

  public async insertMagazine(
    input: CreateMagazineInput,
  ): Promise<SelectMagazine> {
    return await this.txHost.tx.magazine.create({
      ...SELECT_MAGAZINE,
      data: {
        title: input.title,
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

  public async updateMagazineActivatedAtByIdx(
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
}
