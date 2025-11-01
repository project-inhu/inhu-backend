import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_PINNED_MAGAZINE,
  SelectPinnedMagazine,
} from './model/prisma-type/select-pinned-magazine';
import {
  SELECT_PINNED_MAGAZINE_OVERVIEW,
  SelectPinnedMagazineOverview,
} from './model/prisma-type/select-pinned-magazine-overview';

@Injectable()
export class PinnedMagazineCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectPinnedMagazineByIdx(
    idx: number,
  ): Promise<SelectPinnedMagazine | null> {
    return await this.txHost.tx.pinnedMagazine.findUnique({
      ...SELECT_PINNED_MAGAZINE,
      where: {
        idx,
        magazine: { deletedAt: null },
      },
    });
  }

  public async selectPinnedMagazineAll(): Promise<
    SelectPinnedMagazineOverview[]
  > {
    return await this.txHost.tx.pinnedMagazine.findMany({
      ...SELECT_PINNED_MAGAZINE_OVERVIEW,
      where: {
        magazine: { deletedAt: null },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async insertPinnedMagazineByIdx(
    magazineIdx: number,
  ): Promise<SelectPinnedMagazine> {
    return await this.txHost.tx.pinnedMagazine.create({
      ...SELECT_PINNED_MAGAZINE,
      data: {
        idx: magazineIdx,
      },
    });
  }

  public async deletePinnedMagazineIdx(magazineIdx: number): Promise<void> {
    await this.txHost.tx.pinnedMagazine.delete({
      where: {
        idx: magazineIdx,
      },
    });
  }
}
