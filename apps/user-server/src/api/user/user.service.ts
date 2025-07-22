import { Injectable } from '@nestjs/common';
import { UserCoreService } from '@libs/core';
import { UserEntity } from './entity/user.entity';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { LoginUser } from '@user/common/types/LoginUser';

@Injectable()
export class UserService {
  constructor(private readonly userCoreService: UserCoreService) {}

  /**
   * 내 정보 조회
   *
   * @author 조희주
   */
  public async getMyInfo(user: LoginUser): Promise<UserEntity> {
    const userModel = await this.userCoreService.getUserByIdx(user.idx);
    if (!userModel) {
      throw new Error('Authenticated user not found in database');
    }

    return UserEntity.fromModel(userModel);
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  public async updateMyInfo(
    user: LoginUser,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const userModel = await this.userCoreService.getUserByIdx(user.idx);
    if (!userModel) {
      throw new Error('Authenticated user not found in database');
    }

    await this.userCoreService.updateUserByIdx(user.idx, updateUserDto);
  }
}
