import {
  ConflictException,
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
   * 특정 장소와 사용자 조합에 대한 북마크 등록 혹은 복구
   *
   * - 해당 유저가 해당 장소를 북마크한 이력이 없으면 새로 생성
   * - 이미 북마크가 존재하면 예외 발생
   * - soft-delete 상태면 복구
   *
   * @author 강정연
   */
  async createBookmarkByPlaceIdxAndUserIdx(
    placeIdx: number,
    userIdx: number,
  ): Promise<BookmarkEntity | null> {
    await this.placeService.getPlaceByPlaceIdx(placeIdx);

    const bookmark =
      await this.bookmarkRepository.selectBookmarkByPlaceIdxAndUserIdxIncludingDeleted(
        placeIdx,
        userIdx,
      );

    if (!bookmark) {
      return BookmarkEntity.createEntityFromPrisma(
        await this.bookmarkRepository.createBookmarkByPlaceIdxAndUserIdx(
          placeIdx,
          userIdx,
        ),
      );
    } else if (!bookmark.deletedAt) {
      throw new ConflictException('bookmark already exist');
    } else {
      const recovered =
        await this.bookmarkRepository.updateBookmarkDeletedAtToNullByBookmarkIdx(
          bookmark.idx,
        );
      return BookmarkEntity.createEntityFromPrisma(recovered);
    }
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

  /**
   *  특정 장소와 사용자 조합으로 북마크 조회
   *
   * @author 강정연
   */
  async getBookmarkByPlaceIdxAndUserIdx(
    placeIdx: number,
    userIdx: number,
  ): Promise<BookmarkEntity> {
    const bookmark =
      await this.bookmarkRepository.selectBookmarkByPlaceIdxAndUserIdx(
        placeIdx,
        userIdx,
      );

    if (!bookmark) {
      throw new NotFoundException('bookmark not found');
    }

    return BookmarkEntity.createEntityFromPrisma(bookmark);
  }

  /**
   *  특정 장소와 사용자 조합의 북마크 삭제
   *
   * @author 강정연
   */
  async deleteBookmarkByPlaceIdxAndUserIdx(placeIdx: number, userIdx: number) {
    await this.placeService.getPlaceByPlaceIdx(placeIdx);

    const bookmark =
      await this.bookmarkRepository.selectBookmarkByPlaceIdxAndUserIdxIncludingDeleted(
        placeIdx,
        userIdx,
      );

    if (!bookmark) {
      throw new NotFoundException('bookmark not found');
    }

    if (bookmark.deletedAt) {
      throw new ConflictException('bookmark already deleted');
    }

    return await this.bookmarkRepository.deleteBookmarkByBookmarkIdx(
      bookmark.idx,
    );
  }
}
