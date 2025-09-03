import { Injectable, NotFoundException } from '@nestjs/common';
import { BookmarkEntity } from './entity/bookmark.entity';
import { LoginUser } from '@user/common/types/LoginUser';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { BookmarkCoreService } from '@libs/core/bookmark/bookmark-core.service';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly placeCoreService: PlaceCoreService,
    private readonly bookmarkCoreService: BookmarkCoreService,
  ) {}

  public async getAllBookmarkStatus(
    readUserIdx?: number,
  ): Promise<BookmarkEntity[] | null> {
    if (!readUserIdx) {
      return null;
    }

    const bookmarkModelList =
      await this.bookmarkCoreService.getBookmarkStateByUserIdx({
        userIdx: readUserIdx,
      });

    return bookmarkModelList.map((bookmark) =>
      BookmarkEntity.fromModel(bookmark),
    );
  }

  /**
   * 특정 장소에 대한 북마크 등록
   *
   * @author 이수인
   */
  public async createBookmarkByPlaceIdxAndUserIdx(
    loginUser: LoginUser,
    placeIdx: number,
  ): Promise<BookmarkEntity> {
    const place = await this.placeCoreService.getPlaceByIdx(placeIdx);
    if (!place) {
      throw new NotFoundException('Place not found');
    }

    const bookmarkModel = await this.bookmarkCoreService.createBookmark({
      userIdx: loginUser.idx,
      placeIdx: placeIdx,
    });
    return BookmarkEntity.fromModel(bookmarkModel);
  }

  /**
   * 특정 장소에 대한 북마크 삭제
   *
   * @author 이수인
   */
  public async deleteBookmarkByPlaceIdxAndUserIdx(
    loginUser: LoginUser,
    placeIdx: number,
  ): Promise<void> {
    const place = await this.placeCoreService.getPlaceByIdx(placeIdx);
    if (!place) {
      throw new NotFoundException('Place not found');
    }

    await this.bookmarkCoreService.deleteBookmark({
      userIdx: loginUser.idx,
      placeIdx: placeIdx,
    });
  }
}
