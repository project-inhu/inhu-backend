import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { LoginAuth } from 'src/auth/common/decorators/login-auth.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { BookmarkEntity } from './entity/bookmark.entity';
import { Exception } from 'src/common/decorator/exception.decorator';

@Controller('')
export class BookmarkController {
  constructor(private readonly bookmarkServie: BookmarkService) {}

  /**
   * 특정 장소에 대한 북마크 등록
   *
   * @author 강정연
   */
  @LoginAuth
  @Exception(400, 'PlaceIdx must be a number')
  @Exception(404, 'Place does not exist')
  @Exception(409, 'Bookmark already exists')
  @Exception(500, 'Internal Server Error')
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
   * 특정 북마크 삭제
   *
   * @author 강정연
   */
  @LoginAuth
  @Exception(400, 'PlaceIdx must be a number')
  @Exception(404, 'Place or bookmark does not exist')
  @Exception(409, 'Bookmark already deleted')
  @Exception(500, 'Internal Server Error')
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

  /**
   * 특정 사용자가 작성한 리뷰 목록 조회
   *
   * @author 강정연
   */
  @Get('my/bookmark/all')
  async getAllBookmarkByUserIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
  ) {}
}
