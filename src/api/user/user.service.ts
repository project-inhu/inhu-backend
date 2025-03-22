import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserInfoEntity } from './entity/user-info.entity';
import { CreateUserEntity } from './entity/create-user.entity';
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
  async createUser(
    createUserInput: CreateUserInput,
  ): Promise<CreateUserEntity> {
    const { snsId, provider } = createUserInput;

    const user = await this.userRepository.selectUserBySnsId(snsId);
    if (user) {
      return CreateUserEntity.createEntityFromPrisma(user);
    }

    const nickname = await this.generateTemporaryNickname();

    const createUserData = {
      snsId,
      provider,
      nickname,
    };

    const newUser = await this.userRepository.createUser(createUserData);

    return CreateUserEntity.createEntityFromPrisma(newUser);
  }

  /**
   * 내 정보 조회
   *
   * @author 조희주
   */
  async getUser(userIdx: number): Promise<UserInfoEntity> {
    const user = await this.userRepository.selectUserByUserIdx(userIdx);

    return UserInfoEntity.createEntityFromPrisma(user);
  }

  /**
   * 내 정보 수정
   *
   * @author 조희주
   */
  async updateUser(updateUserInput: UpdateUserInput): Promise<UserInfoEntity> {
    const { userIdx, nickname, profileImagePath } = updateUserInput;

    const user = await this.userRepository.selectUserByUserIdx(userIdx);

    if (
      nickname &&
      (await this.userRepository.selectUserByNickname(nickname))
    ) {
      throw new ConflictException('This nickname is already in use.');
    }

    const updatedUser = await this.userRepository.updateUserByUserIdx({
      userIdx,
      nickname: nickname ?? user.nickname,
      profileImagePath: profileImagePath ?? user.profileImagePath,
    });

    return UserInfoEntity.createEntityFromPrisma(updatedUser);
  }

  /**
   * 회원 탈퇴
   *
   * @author 조희주
   */
  async deleteUser(userIdx: number): Promise<void> {
    await this.userRepository.selectUserByUserIdx(userIdx);
    await this.userRepository.deleteUserByUserIdx(userIdx);
  }
}
