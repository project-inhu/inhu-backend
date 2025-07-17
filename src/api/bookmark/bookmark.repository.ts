import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class BookmarkRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 특정 장소에 대한 북마크 등록
   *
   * @author 강정연
   */
  async createBookmarkByPlaceIdxAndUserIdx(
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
   * 특정 장소와 사용자 조합으로 북마크 조회
   *
   * 내부 로직이므로 Bookmark로만 반환
   *
   * @author 강정연
   */
  async selectBookmarkByPlaceIdxAndUserIdx(
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
   * 특정 장소와 사용자 조합으로 북마크 삭제
   *
   * @author 강정연
   */
  async deleteBookmarkByBookmarkIdx(
    placeIdx: number,
    userIdx: number,
  ): Promise<void> {
    await this.prisma.bookmark.delete({
      where: {
        userIdx_placeIdx: {
          userIdx,
          placeIdx,
        },
      },
    });
  }
}
