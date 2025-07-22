import { Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { Exception } from '@libs/common';
import { User } from '@user/common/decorator/user.decorator';
import { BookmarkEntity } from './entity/bookmark.entity';
import { LoginUser } from '@user/common/types/LoginUser';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  /**
   * 특정 장소에 대한 북마크 등록
   *
   * @author 이수인
   */
  @LoginAuth()
  @ApiTags('Bookmark')
  @Exception(400, 'Invalid placeIdx')
  @Exception(404, 'Place not found')
  @Exception(409, '이미 북마크가 있습니다.')
  @Post('place/:placeIdx/bookmark')
  async createBookmarkByPlaceIdxAndUserIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @User() loginUser: LoginUser,
  ): Promise<BookmarkEntity> {
    return await this.bookmarkService.createBookmarkByPlaceIdxAndUserIdx(
      loginUser,
      placeIdx,
    );
  }

  /**
   * 특정 장소에 대한 북마크 삭제
   *
   * @author 이수인
   */
  @LoginAuth()
  @ApiTags('Bookmark')
  @Exception(400, 'Invalid placeIdx')
  @Exception(404, 'Place not found')
  @Exception(409, '이미 북마크가 아닙니다.')
  @Delete('place/:placeIdx/bookmark')
  async deleteBookmarkByPlaceIdxAndUserIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @User() loginUser: LoginUser,
  ): Promise<void> {
    return await this.bookmarkService.deleteBookmarkByPlaceIdxAndUserIdx(
      loginUser,
      placeIdx,
    );
  }
}
