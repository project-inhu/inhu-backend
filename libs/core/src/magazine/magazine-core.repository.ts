import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_MAGAZINE,
  SelectMagazine,
} from './model/prisma-type/select-magazine';
import { Prisma } from '@prisma/client';

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

  public async selectMagazineAll(): Promise<SelectMagazine[]> {
    return await this.txHost.tx.magazine.findMany({
      ...SELECT_MAGAZINE,
      where: {
        AND: [{ deletedAt: null }, this.getActivatedAtFilterWhereClause(true)],
      },
      orderBy: {
        activatedAt: 'desc',
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
