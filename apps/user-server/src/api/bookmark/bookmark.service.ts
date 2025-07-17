import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
   * 특정 장소와 사용자 조합에 대한 북마크 등록
   *
   * @author 강정연
   */
  async createBookmarkByPlaceIdxAndUserIdx(
    placeIdx: number,
    userIdx: number,
  ): Promise<BookmarkEntity | null> {
    await this.placeService.getPlaceByPlaceIdx(placeIdx);

    const bookmark =
      await this.bookmarkRepository.selectBookmarkByPlaceIdxAndUserIdx(
        placeIdx,
        userIdx,
      );

    if (bookmark) {
      throw new ConflictException('bookmark already exist');
    } else {
      const created =
        await this.bookmarkRepository.createBookmarkByPlaceIdxAndUserIdx(
          placeIdx,
          userIdx,
        );

      return BookmarkEntity.createEntityFromPrisma(created);
    }
  }

  /**
   *  특정 Idx의 북마크 삭제 (idx 제공 시)
   *
   * @author 강정연
   */
  async deleteBookmarkByPlaceIdxAndUserIdx(
    placeIdx: number,
    userIdx: number,
  ): Promise<void> {
    await this.placeService.getPlaceByPlaceIdx(placeIdx);

    const bookmark =
      await this.bookmarkRepository.selectBookmarkByPlaceIdxAndUserIdx(
        placeIdx,
        userIdx,
      );

    if (!bookmark) {
      throw new NotFoundException('bookmark not found');
    }

    return await this.bookmarkRepository.deleteBookmarkByPlaceIdxAndUserIdx(
      placeIdx,
      userIdx,
    );
  }
}
