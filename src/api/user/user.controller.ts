import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { GetMyInfoResponseDto } from './dto/user-info-response.dto';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 내 프로필 조회 API
   * - 인증된 사용자의 닉네임과 프로필 이미지 반환
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
}
