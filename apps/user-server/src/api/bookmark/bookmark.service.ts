import { BookmarkCoreService, PlaceCoreService } from '@libs/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BookmarkEntity } from './entity/bookmark.entity';
import { LoginUser } from '@user/common/types/LoginUser';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly placeCoreService: PlaceCoreService,
    private readonly bookmarkCoreService: BookmarkCoreService,
  ) {}

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
