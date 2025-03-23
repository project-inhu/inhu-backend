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
import { MyInfoDto } from './dto/my-info.dto';
import { User } from 'src/common/decorator/user.decorator';
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
  async getUserByUserIdx(
    @User('idx') userIdx: number,
  ): Promise<UserInfoEntity> {
    return await this.userService.getUserByUserIdx(userIdx);
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Patch()
  async updateUserByUserIdx(
    @User('idx') userIdx: number,
    @Body() myInfoDto: MyInfoDto,
  ): Promise<UserInfoEntity> {
    return this.userService.updateUserByUserIdx({
      userIdx,
      nickname: myInfoDto.nickname,
      profileImagePath: myInfoDto.profileImagePath,
    });
  }

  /**
   * 회원 탈퇴
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Delete()
  async deleteUserByUserIdx(@User('idx') userIdx: number): Promise<void> {
    await this.userService.deleteUserByUserIdx(userIdx);
  }
}
