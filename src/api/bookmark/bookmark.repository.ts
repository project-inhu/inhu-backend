import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { BookmarkSelectField } from './type/bookmark-select-field';

@Injectable()
export class BookmarkRepository {
  constructor(private readonly prisma: PrismaService) {}

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
