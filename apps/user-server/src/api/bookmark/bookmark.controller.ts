import { Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { LoginAuth } from 'src/auth/common/decorators/login-auth.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { BookmarkEntity } from './entity/bookmark.entity';
import { Exception } from 'src/common/decorator/exception.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('')
export class BookmarkController {
  constructor(private readonly bookmarkServie: BookmarkService) {}

  /**
   * 특정 장소에 대한 북마크 등록
   *
   * @author 강정연
   */
  @LoginAuth
  @Exception(400, 'Invalid placeIdx')
  @Exception(404, 'Place not found')
  @Exception(409, 'Bookmark already exists')
  @Post('place/:placeIdx/bookmark')
  async createBookmarkByPlaceIdxAndUserIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @User('idx') userIdx: number,
  ): Promise<BookmarkEntity | null> {
    return await this.bookmarkServie.createBookmarkByPlaceIdxAndUserIdx(
      placeIdx,
      userIdx,
    );
  }

  /**
   * 특정 장소에 대한 북마크 삭제
   *
   * @author 강정연
   */
  @LoginAuth
  @Exception(400, 'Invalid placeIdx')
  @Exception(404, 'Place not found')
  @Exception(403, 'Permission denied')
  @Exception(409, 'Bookmark already deleted')
  @Delete('place/:placeIdx/bookmark')
  async deleteBookmarkByPlaceIdxAndUserIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @User('idx') userIdx: number,
  ): Promise<void> {
    await this.bookmarkServie.deleteBookmarkByPlaceIdxAndUserIdx(
      placeIdx,
      userIdx,
    );
  }
}
