import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceService } from '../place/place.service';
import { BookmarkRepository } from './bookmark.repository';
import { BookmarkEntity } from './entity/bookmark.entity';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly placeService: PlaceService,
  ) {}

  /**
   * 특정 장소에 대한 북마크 등록
   *
   * @author 강정연
   */
  async createBookmarkByPlaceIdx(placeIdx: number, userIdx: number) {
    await this.placeService.getPlaceByPlaceIdx(placeIdx);
    const review = await this.bookmarkRepository.createBookmarkByPlaceIdx(
      placeIdx,
      userIdx,
    );

    return this.getBookmarkByBookmarkIdx(review.idx);
  }

  /**
   *  특정 Idx의 북마크 조회
   *
   * @author 강정연
   */
  async getBookmarkByBookmarkIdx(bookmarkIdx: number): Promise<BookmarkEntity> {
    const bookmark =
      await this.bookmarkRepository.selectBookmarkByBookmarkIdx(bookmarkIdx);

    if (!bookmark) {
      throw new NotFoundException('bookmark not found');
    }

    return BookmarkEntity.createEntityFromPrisma(bookmark);
  }
}
