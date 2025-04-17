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
  async createBookmarkByPlaceIdx(placeIdx: number, userIdx: number) {
    await this.placeService.getPlaceByPlaceIdx(placeIdx);
    const review = await this.bookmarkRepository.createBookmarkByPlaceIdx(
      placeIdx,
      userIdx,
    );

    return this.getBookmarkByBookmarkIdx(review.idx);
  }

  async getBookmarkByBookmarkIdx(bookmarkIdx: number): Promise<BookmarkEntity> {
    const bookmark =
      await this.bookmarkRepository.selectBookmarkByBookmarkIdx(bookmarkIdx);

    if (!bookmark) {
      throw new NotFoundException('bookmark not found');
    }

    return BookmarkEntity.createEntityFromPrisma(bookmark);
  }
}
