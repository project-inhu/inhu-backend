import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCoreService } from '@libs/core';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userCoreService: UserCoreService) {}

  /**
   * 내 정보 조회
   *
   * @author 조희주
   */
  async getUserByIdx(userIdx: number): Promise<UserEntity> {
    const user = await this.userCoreService.getUserByIdx(userIdx);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserEntity.fromModel(user);
  }
}
