import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { UserInfoEntity } from './entity/user-info.entity';
import { GetPresignedUrlResponseDto } from 'src/common/s3/dto/get-presigned-url-response.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 내 정보 조회
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Get()
  async getUserByUserIdx(
    @User('idx') userIdx: number,
  ): Promise<UserInfoEntity> {
    return await this.userService.getUserByUserIdx(userIdx);
  }

  /**
   * 닉네임 수정
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Patch('/nickname')
  async updateNicknameByUserIdx(
    @User('idx') userIdx: number,
    @Body('nickname') nickname: string,
  ): Promise<UserInfoEntity> {
    return this.userService.updateNicknameByUserIdx({ userIdx, nickname });
  }

  /**
   * 프로필 이미지 업로드를 위한 Presigned URL 발급
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Get('/profile-image/presigned-url')
  async getPresignedUrl(
    @Query('filename') filename: string,
  ): Promise<GetPresignedUrlResponseDto> {
    return this.userService.getPresignedUrl(filename);
  }

  /**
   * S3 업로드 완료 후, 이미지 키를 DB에 저장
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Patch('/profile-image')
  async updateProfileImagePathByUserIdx(
    @User('idx') userIdx: number,
    @Body('imageKey') imageKey: string,
  ): Promise<UserInfoEntity> {
    return this.userService.updateProfileImagePathByUserIdx({
      userIdx,
      imageKey,
    });
  }

  /**
   * 회원 탈퇴
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Delete()
  async deleteUserByUserIdx(@User('idx') userIdx: number): Promise<void> {
    await this.userService.deleteUserByUserIdx(userIdx);
  }
}
