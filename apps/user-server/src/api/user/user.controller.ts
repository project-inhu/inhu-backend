import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@user/auth/common/guards/auth.guard';
import { User } from '@user/common/decorator/user.decorator';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

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
