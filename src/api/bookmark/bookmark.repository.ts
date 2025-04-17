import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { BookmarkSelectField } from './type/bookmark-select-field';

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
   * 특정 idx의 북마크 조회
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
}
