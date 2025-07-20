import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@user/auth/common/guards/auth.guard';
import { User } from '@user/common/decorator/user.decorator';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';

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
  async getUserByIdx(
    @User('idx') userIdx: number,
  ): Promise<GetUserResponseDto> {
    return await this.userService.getUserByIdx(userIdx);
  }
}
