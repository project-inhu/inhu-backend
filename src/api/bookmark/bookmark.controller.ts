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

@Controller('')
export class BookmarkController {
  constructor(private readonly bookmarkServie: BookmarkService) {}

  /**
   * 특정 장소에 대한 북마크 등록
   *
   * @author 강정연
   */
  @LoginAuth
  @Post('place/:placeIdx/bookmark')
  async createBookmarkByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @User('idx') userIdx: number,
  ) {}

  /**
   * 특정 장소에 대한 북마크 삭제
   *
   * @author 강정연
   */
  @Delete('place/:placeIdx/bookmark')
  async deleteBookmarkByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @User('idx') userIdx: number,
  ) {}

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
