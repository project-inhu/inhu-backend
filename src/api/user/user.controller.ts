import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { MyInfoResponseDto } from './dto/my-info-response.dto';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { MyProfileImageResponseDto } from './dto/my-profile-image-response.dto';
import { MyProfileImageDto } from './dto/my-profile-image.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 내 프로필 조회(닉네임, 프로필 이미지) API
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Get()
  async getMyInfoByUserIdx(
    @Req() req: RequestWithUser,
  ): Promise<MyInfoResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.userService.getMyInfoByUserIdx(req.user.idx);
  }

  /**
   * 내 프로필 이미지 수정 API
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Patch('profile-image')
  async updateMyProfileImageByUserIdx(
    @Req() req: RequestWithUser,
    @Body() body: { profileImagePath: string | null },
  ): Promise<MyProfileImageResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userIdx = req.user.idx;

    const myProfileImageDto: MyProfileImageDto = {
      idx: userIdx,
      profileImagePath: body.profileImagePath,
    };

    return this.userService.updateMyProfileImageByUserIdx(myProfileImageDto);
  }
}
