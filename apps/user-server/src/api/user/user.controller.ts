import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@user/common/decorator/user.decorator';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { LoginUser } from '@user/common/types/LoginUser';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 내 정보 조회
   *
   * @author 조희주
   */
  @Get()
  @LoginAuth()
  async getUserByIdx(@User() user: LoginUser): Promise<GetUserResponseDto> {
    return await this.userService.getUserByIdx(user.idx);
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  @Put()
  @LoginAuth()
  async updateUserByIdx(
    @User() user: LoginUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.userService.updateUserByIdx(user.idx, updateUserDto);
  }

  /**
   * 회원 탈퇴
   *
   * @author 조희주
   */
  @Delete()
  @LoginAuth()
  async deleteUserByIdx(@User() user: LoginUser): Promise<void> {
    await this.userService.deleteUserByIdx(user.idx);
  }
}
