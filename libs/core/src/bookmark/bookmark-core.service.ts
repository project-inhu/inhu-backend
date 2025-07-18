import { BookmarkModel } from './model/bookmark.model';
import { BookmarkCoreRepository } from './bookmark-core.repository';
import { GetBookmarkAllInput } from './inputs/get-bookmark-all.input';
import { Injectable } from '@nestjs/common';
import { CreateBookmarkInput } from './inputs/create-bookmark.input';
import { DeleteBookmarkInput } from './inputs/delete-bookmark.input';
import { GetBookmarkInput } from './inputs/get-bookmark.input';
import { AlreadyNotBookmarkException } from './exception/already-not-bookmark.exception';
import { AlreadyBookmarkException } from './exception/already-bookmark.exception';
import { PlaceCoreService } from '@app/core/place/place-core.service';

@Injectable()
export class BookmarkCoreService {
  constructor(
    private readonly bookmarkCoreRepository: BookmarkCoreRepository,
    private readonly placeCoreService: PlaceCoreService,
  ) {}

  public async getBookmarkByIdx(
    input: GetBookmarkInput,
  ): Promise<BookmarkModel | null> {
    const bookmark =
      await this.bookmarkCoreRepository.selectBookmarkByIdx(input);

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

  /**
   * 북마크 생성하기
   *
   * @throws {AlreadyBookmarkException} 409 - 이미 북마크가 존재하는 경우
   */
  public async createBookmark(
    input: CreateBookmarkInput,
  ): Promise<BookmarkModel> {
    const existingBookmark =
      await this.bookmarkCoreRepository.selectBookmarkByIdx(input);

    if (existingBookmark) {
      throw new AlreadyBookmarkException('이미 북마크가 있습니다.');
    }

    await this.placeCoreService.increasePlaceBookmarkCount(input.placeIdx);
    return await this.bookmarkCoreRepository
      .insertBookmark(input)
      .then(BookmarkModel.fromPrisma);
  }

  /**
   * 북마크 삭제하기
   *
   * @throws {AlreadyNotBookmarkException} 409 - 이미 북마크가 아닌 경우
   */
  public async deleteBookmark(input: DeleteBookmarkInput): Promise<void> {
    const bookmark =
      await this.bookmarkCoreRepository.selectBookmarkByIdx(input);

    if (!bookmark) {
      throw new AlreadyNotBookmarkException('이미 북마크가 아닙니다.');
    }

    await this.placeCoreService.decreasePlaceBookmarkCount(input.placeIdx);
    return await this.bookmarkCoreRepository.deleteBookmark(input);
  }
}
