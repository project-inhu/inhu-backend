import { CreateBookmarkInput } from './inputs/create-bookmark.input';
import { GetBookmarkAllInput } from './inputs/get-bookmark-all.input';
import { SelectBookmark } from './model/prisma-type/select-bookmark';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { DeleteBookmarkInput } from './inputs/delete-bookmark.input';
import { GetBookmarkInput } from './inputs/get-bookmark.input';

@Injectable()
export class BookmarkCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectBookmarkByIdx({
    userIdx,
    placeIdx,
  }: GetBookmarkInput): Promise<SelectBookmark | null> {
    return await this.txHost.tx.bookmark.findUnique({
      select: {
        placeIdx: true,
        userIdx: true,
        createdAt: true,
      },
      where: {
        userIdx_placeIdx: {
          userIdx,
          placeIdx,
        },
      },
    });
  }

  public async selectBookmarkAllByUserIdx(
    input: GetBookmarkAllInput,
  ): Promise<SelectBookmark[]> {
    return await this.txHost.tx.bookmark.findMany({
      select: {
        userIdx: true,
        placeIdx: true,
        createdAt: true,
      },
      where: {
        place: { deletedAt: null },
        userIdx: input.userIdx,
        placeIdx: {
          in: input.placeIdxList,
        },
      },
    });
  }

  public async insertBookmark(
    input: CreateBookmarkInput,
  ): Promise<SelectBookmark> {
    return await this.txHost.tx.bookmark.create({
      select: {
        userIdx: true,
        placeIdx: true,
        createdAt: true,
      },
      data: {
        userIdx: input.userIdx,
        placeIdx: input.placeIdx,
      },
    });
  }

  public async deleteBookmark(input: DeleteBookmarkInput): Promise<void> {
    await this.txHost.tx.bookmark.delete({
      where: {
        userIdx_placeIdx: {
          userIdx: input.userIdx,
          placeIdx: input.placeIdx,
        },
      },
    });
  }
}
