import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { UserInfoEntity } from './entity/user-info.entity';
import { FileInterceptor } from '@nestjs/platform-express';

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
   * 닉네임 수정
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Patch('/nickname')
  async updateNicknameByUserIdx(
    @User('idx') userIdx: number,
    @Body('nickname') nickname: string,
  ): Promise<UserInfoEntity> {
    return this.userService.updateNicknameByUserIdx({ userIdx, nickname });
  }

  /**
   * 프로필 이미지 수정
   *
   * @author 조희주
   */
  @UseGuards(AuthGuard)
  @Patch('/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImageByUserIdx(
    @User('idx') userIdx: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserInfoEntity> {
    return this.userService.updateProfileImageByUserIdx({ userIdx, file });
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
