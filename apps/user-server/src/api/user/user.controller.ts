import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@user/auth/common/guards/auth.guard';
import { User } from '@user/common/decorator/user.decorator';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { S3_FOLDER, S3Service } from '@libs/common';
import { GetPresignedUrlResponseDto } from './dto/response/get-presigned-url-response.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private s3Service: S3Service,
  ) {}

  /**
   * 내 정보 조회
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Get()
  async getUserByIdx(
    @User('idx') userIdx: number,
  ): Promise<GetUserResponseDto> {
    return await this.userService.getUserByIdx(userIdx);
  }

  /**
   * 프로필 이미지 업로드를 위한 Presigned URL 발급
   * 프론트엔드에서 이 URL을 받아 S3에 파일을 직접 업로드
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Get('/profile-image/presigned-url')
  async getProfileImagePresignedUrl(
    @Query('fileName') filename: string,
  ): Promise<GetPresignedUrlResponseDto> {
    return await this.s3Service.getPresignedUrl({
      folder: S3_FOLDER.PROFILE,
      filename,
    });
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Put()
  async updateUserByIdx(
    @User('idx') userIdx: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.userService.updateUserByIdx(userIdx, updateUserDto);
  }
}
