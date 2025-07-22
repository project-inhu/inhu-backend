import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserEntity } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 내 정보 조회
   *
   * @author 조희주
   */
  @Get()
  @LoginAuth()
  async getUserByIdx(@User() user: LoginUser): Promise<UserEntity> {
    return await this.userService.getUserByIdx(user.idx);
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  @Patch()
  @LoginAuth()
  async updateUserByIdx(
    @User() user: LoginUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.userService.updateUserByIdx(user.idx, updateUserDto);
  }
}
