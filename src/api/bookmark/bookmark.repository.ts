import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { BookmarkSelectField } from './type/bookmark-select-field';
import { BOOKMARK_SELECT_FIELD } from './type/bookmark-select-field';

@Injectable()
export class BookmarkRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 특정 장소에 대한 북마크 등록
   *
   * @author 강정연
   */
  async createBookmarkByPlaceIdx(
    placeIdx: number,
    userIdx: number,
  ): Promise<Bookmark> {
    return await this.prisma.bookmark.create({
      data: {
        placeIdx,
        userIdx,
      },
    });
  }

  /**
   * 특정 idx의 삭제되지 않은 북마크 조회
   *
   * @author 강정연
   */
  async selectBookmarkByBookmarkIdx(
    bookmarkIdx: number,
  ): Promise<BookmarkSelectField | null> {
    return await this.prisma.bookmark.findUnique({
      where: {
        idx: bookmarkIdx,
        deletedAt: null,
      },
      select: {
        idx: true,
        userIdx: true,
        placeIdx: true,
        createdAt: true,
      },
    });
  }

  /**
   *  특정 장소와 사용자 조합의 삭제되지 않은 북마크 조회
   *
   * @author 강정연
   */
  async selectBookmarkByPlaceIdxAndUserIdx(
    placeIdx: number,
    userIdx: number,
  ): Promise<BookmarkSelectField | null> {
    return await this.prisma.bookmark.findFirst({
      where: {
        placeIdx,
        userIdx,
        deletedAt: null,
      },
      select: {
        idx: true,
        userIdx: true,
        placeIdx: true,
        createdAt: true,
      },
    });
  }

  /**
   * 특정 idx의 북마크 삭제
   *
   * @author 강정연
   */
  async deleteBookmarkByBookmarkIdx(bookmarkIdx: number): Promise<void> {
    await this.prisma.bookmark.update({
      where: {
        idx: bookmarkIdx,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * 특정 장소와 사용자 조합으로 삭제 여부 관계 없이 북마크 조회
   *
   * @author 강정연
   */
  async selectBookmarkByPlaceIdxAndUserIdxIncludingDeleted(
    placeIdx: number,
    userIdx: number,
  ): Promise<Bookmark | null> {
    return this.prisma.bookmark.findFirst({
      where: {
        placeIdx,
        userIdx,
      },
    });
  }

  /**
   * 삭제된 북마크를 복구
   *
   * @author 강정연
   */
  async updateBookmarkDeletedAtToNullByBookmarkIdx(
    bookmarkIdx: number,
  ): Promise<Bookmark> {
    return this.prisma.bookmark.update({
      where: { idx: bookmarkIdx },
      data: { deletedAt: null, createdAt: new Date() },
    });
  }
}
