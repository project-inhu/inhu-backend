import { BookmarkModel } from './model/bookmark.model';
import { BookmarkCoreRepository } from './bookmark-core.repository';
import { GetBookmarkAllInput } from './inputs/get-bookmark-all.input';
import { Injectable } from '@nestjs/common';
import { CreateBookmarkInput } from './inputs/create-bookmark.input';
import { DeleteBookmarkInput } from '@app/core/bookmark/inputs/delete-bookmark.input';

@Injectable()
export class BookmarkCoreService {
  constructor(
    private readonly bookmarkCoreRepository: BookmarkCoreRepository,
  ) {}

  public async getBookmarkByIdx(
    userIdx: number,
    placeIdx: number,
  ): Promise<BookmarkModel | null> {
    const bookmark = await this.bookmarkCoreRepository.selectBookmarkByIdx(
      userIdx,
      placeIdx,
    );

    return bookmark ? BookmarkModel.fromPrisma(bookmark) : null;
  }

  public async getBookmarkStateByUserIdx(
    userIdx: number,
    input: GetBookmarkAllInput,
  ): Promise<BookmarkModel[]> {
    return await this.bookmarkCoreRepository
      .selectBookmarkAllByUserIdx(userIdx, input)
      .then((bookmarks) => bookmarks.map(BookmarkModel.fromPrisma));
  }

  public async createBookmark(
    input: CreateBookmarkInput,
  ): Promise<BookmarkModel> {
    return await this.bookmarkCoreRepository
      .insertBookmark(input)
      .then(BookmarkModel.fromPrisma);
  }

  public async deleteBookmark(input: DeleteBookmarkInput): Promise<void> {
    return await this.bookmarkCoreRepository.deleteBookmark(input);
  }
}
