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
import { GetMyInfoResponseDto } from './dto/user-info-response.dto';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { UserProfileImageResponseDto } from './dto/user-profile-image-response.dto';

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
  ): Promise<GetMyInfoResponseDto> {
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
    @Body() body: { profileImagePath: string },
  ): Promise<UserProfileImageResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userIdx = req.user.idx;

    return this.userService.updateMyProfileImageByUserIdx(
      userIdx,
      body.profileImagePath,
    );
  }
}
