import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { MyInfoResponseDto } from './dto/my-info-response.dto';
import { LoginUser } from './common/decorator/login-user.dcorator';
import { UserEntity } from './entity/user.entity';
import { MyInfoDto } from './dto/my-info.dto';

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
  async getMyInfoByUserIdx(
    @LoginUser() user: UserEntity,
  ): Promise<MyInfoResponseDto> {
    return await this.userService.getMyInfo(user.idx);
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Patch()
  async updateMyInfoByUserIdx(
    @LoginUser() user: UserEntity,
    @Body() updateData: MyInfoDto,
  ): Promise<MyInfoResponseDto> {
    return this.userService.updateMyInfoByUserIdx(user.idx, updateData);
  }

  /**
   * 회원 탈퇴
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@LoginUser() user: UserEntity): Promise<MyInfoResponseDto> {
    return this.userService.deleteUser(user.idx);
  }
}
