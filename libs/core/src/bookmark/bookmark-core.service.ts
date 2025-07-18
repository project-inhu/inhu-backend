import { BookmarkModel } from '@app/core/bookmark/model/bookmark.model';
import { BookmarkCoreRepository } from './bookmark-core.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkCoreService {
  constructor(private readonly bookmarkCoreReposit: BookmarkCoreRepository) {}

  public async getBookmarkByIdx(
    userIdx: number,
    placeIdx: number,
  ): Promise<BookmarkModel | null> {
    const bookmark = await this.bookmarkCoreReposit.selectBookmarkByIdx(
      userIdx,
      placeIdx,
    );

    return bookmark ? BookmarkModel.fromPrisma(bookmark) : null;
  }
}
