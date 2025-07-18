import { SelectKeyword } from '@app/core/keyword/model/prisma-type/select-keyword';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeywordCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectKeywordByIdx(idx: number): Promise<SelectKeyword | null> {
    return await this.txHost.tx.keyword.findUnique({
      select: {
        idx: true,
        content: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectKeywordAll(): Promise<SelectKeyword[]> {
    return await this.txHost.tx.keyword.findMany({
      select: {
        idx: true,
        content: true,
      },
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'asc',
      },
    });
  }
}
