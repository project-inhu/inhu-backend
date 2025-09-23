import { CreateKeywordInput } from './inputs/create-keyword.input';
import { UpdateKeywordInput } from './inputs/update-keyword.input';
import { SelectKeyword } from './model/prisma-type/select-keyword';
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

  public async insertKeyword(
    input: CreateKeywordInput,
  ): Promise<SelectKeyword> {
    return await this.txHost.tx.keyword.create({
      select: {
        idx: true,
        content: true,
      },
      data: {
        idx: input.idx,
        content: input.content,
      },
    });
  }

  public async updateKeywordByIdx(
    idx: number,
    input: UpdateKeywordInput,
  ): Promise<void> {
    await this.txHost.tx.keyword.update({
      data: {
        content: input.content,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async softDeleteKeywordByIdx(idx: number): Promise<void> {
    await this.txHost.tx.keyword.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }
}
