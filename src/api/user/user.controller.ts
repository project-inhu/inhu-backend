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
import { ApiResponse } from '@nestjs/swagger';
import { UserInfoEntity } from './entity/user-info.entity';

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
  @ApiResponse({ status: 200, description: '성공', type: UserInfoEntity })
  @ApiResponse({ status: 401, description: '인증실패' })
  async getMyInfoByUserIdx(
    @LoginUser() user: UserEntity,
  ): Promise<MyInfoResponseDto> {
    return await this.userService.getMyInfo({ idx: user.idx });
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
    return this.userService.updateMyInfo(user.idx, updateData);
  }

  /**
   * 회원 탈퇴
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@LoginUser() user: UserEntity): Promise<MyInfoResponseDto> {
    return this.userService.deleteUser({ idx: user.idx });
  }
}
