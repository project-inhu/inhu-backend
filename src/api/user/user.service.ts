import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserInfoEntity } from './entity/user-info.entity';
import { SocialUserEntity } from './entity/social-user.entity';
import { RegisterUserEntity } from './entity/register-user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  /**
   * 소셜 로그인 후 사용자 조회 및 등록
   *
   * @author 조희주
   */
  async registerUser(userInfo: SocialUserEntity): Promise<RegisterUserEntity> {
    if (!userInfo.snsId || !userInfo.provider) {
      throw new BadRequestException('SNS ID and provider are required.');
    }

    const snsId = userInfo.snsId;
    const provider = userInfo.provider;

    const user = await this.userRepository.selectUserBySnsId(snsId);
    if (user) {
      return { idx: user.idx };
    }

    const newUser = await this.userRepository.insertUser(snsId, provider);
    return { idx: newUser.idx };
  }

  /**
   * 내 정보 조회 (프로필 이미지, 닉네임)
   *
   * @author 조희주
   */
  async getMyInfo(idx: number): Promise<UserInfoEntity> {
    const user = await this.userRepository.selectUserByIdx(idx);

    if (!user) {
      throw new InternalServerErrorException(
        'Failed to retrieve user information due to an internal server error.',
      );
    }

    return {
      idx: user.idx,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  async updateMyInfoByUserIdx(
    idx: number,
    updateData: Partial<UserInfoEntity>,
  ): Promise<UserInfoEntity> {
    const user = await this.userRepository.selectUserByIdx(idx);

    if (!user) {
      throw new InternalServerErrorException(
        'Failed to retrieve user information due to an internal server error.',
      );
    }

    if (updateData.nickname) {
      const isDuplicate = await this.userRepository.isDuplicatedNickname(
        updateData.nickname,
      );
      if (isDuplicate) {
        throw new ConflictException('This nickname is already in use.');
      }
    }

    const updatedUser = await this.userRepository.updateUserByIdx(
      idx,
      updateData,
    );

    return {
      idx: updatedUser.idx,
      nickname: updatedUser.nickname,
      profileImagePath: updatedUser.profileImagePath,
      createdAt: updatedUser.createdAt,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * 회원 탈퇴
   *
   * @author 조희주
   */
  async deleteUser(idx: number): Promise<UserInfoEntity> {
    const user = await this.userRepository.selectUserByIdx(idx);

    if (!user) {
      throw new InternalServerErrorException(
        'Failed to retrieve user information due to an internal server error.',
      );
    }

    const deletedUser = await this.userRepository.deleteUserByIdx(idx);

    return {
      idx: deletedUser.idx,
      nickname: deletedUser.nickname,
      profileImagePath: deletedUser.profileImagePath,
      createdAt: deletedUser.createdAt,
      deletedAt: deletedUser.deletedAt,
    };
  }
}
