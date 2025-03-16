import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserInfoEntity } from './entity/user-info.entity';
import { RegisterUserEntity } from './entity/register-user.entity';
import { CreateUserInput } from './input/create-user.input';
import { UpdateUserInput } from './input/update-user.input';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  /**
   * 새로운 사용자를 위한 임시 닉네임 생성
   *
   * @author 조희주
   */
  async generateTemporaryNickname(): Promise<string> {
    const userCount = await this.userRepository.getUserCount();
    return `${userCount + 1}번째 인후러`;
  }

  /**
   * 소셜 로그인 후 사용자 조회 및 등록
   *
   * @author 조희주
   */
  async registerUser(
    createUserInput: CreateUserInput,
  ): Promise<RegisterUserEntity> {
    const snsId = createUserInput.snsId;
    const provider = createUserInput.provider;

    const user = await this.userRepository.selectUserBySnsId(snsId);
    if (user) {
      return RegisterUserEntity.createEntityFromPrisma(user);
    }

    const nickname = await this.generateTemporaryNickname();
    const newUser = await this.userRepository.insertUser(
      snsId,
      provider,
      nickname,
    );
    return RegisterUserEntity.createEntityFromPrisma(newUser);
  }

  /**
   * 내 정보 조회
   *
   * @author 조희주
   */
  async getMyInfo(userIdx: number): Promise<UserInfoEntity> {
    const user = await this.userRepository.selectUserByIdx(userIdx);
    return UserInfoEntity.createEntityFromPrisma(user);
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  async updateMyInfo(
    userIdx: number,
    updateUserInput: UpdateUserInput,
  ): Promise<UserInfoEntity> {
    const user = await this.userRepository.selectUserByIdx(userIdx);

    if (updateUserInput.nickname) {
      const existingUser = await this.userRepository.selectUserByNickname(
        updateUserInput.nickname,
      );
      if (existingUser) {
        throw new ConflictException('This nickname is already in use.');
      }
    }

    const updatedUser = await this.userRepository.updateUserByIdx(userIdx, {
      nickname: updateUserInput.nickname ?? user.nickname,
      profileImagePath:
        updateUserInput.profileImagePath ?? user.profileImagePath,
    });

    return UserInfoEntity.createEntityFromPrisma(updatedUser);
  }

  /**
   * 회원 탈퇴
   *
   * @author 조희주
   */
  async deleteUser(userIdx: number): Promise<UserInfoEntity> {
    await this.userRepository.selectUserByIdx(userIdx);
    const deletedUser = await this.userRepository.deleteUserByIdx(userIdx);
    return UserInfoEntity.createEntityFromPrisma(deletedUser);
  }
}
