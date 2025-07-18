import { GetBookmarkAllInput } from './inputs/get-bookmark-all.input';
import { SelectBookmark } from './model/prisma-type/select-bookmark';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectBookmarkByIdx(
    userIdx: number,
    placeIdx: number,
  ): Promise<SelectBookmark | null> {
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
    userIdx: number,
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
        userIdx,
        placeIdx: {
          in: input.placeIdxList,
        },
      },
    });
  }
}
