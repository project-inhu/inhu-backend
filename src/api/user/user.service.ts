import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserInfoEntity } from './entity/user-info.entity';
import { CreateUserEntity } from './entity/create-user.entity';
import { CreateUserInput } from './input/create-user.input';
import { UpdateUserInput } from './input/update-user.input';
import { S3Service } from 'src/common/s3/s3.service';
import { S3Folder } from 'src/common/s3/enums/s3-folder.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * 새로운 사용자를 위한 임시 닉네임 생성
   *
   * @author 조희주
   */
  async generateTemporaryNickname(): Promise<string> {
    const maxIdx = await this.userRepository.getMaxUserIdx();
    return `${maxIdx + 1}번째 인후러`;
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
  async getUserByUserIdx(userIdx: number): Promise<UserInfoEntity> {
    const user = await this.userRepository.selectUserByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserInfoEntity.createEntityFromPrisma(user);
  }

  /**
   * 닉네임 수정
   *
   * @author 조희주
   */
  async updateNicknameByUserIdx(
    userIdx: number,
    nickname: string,
  ): Promise<UserInfoEntity> {
    if (!nickname) {
      throw new BadRequestException('You need nickname.');
    }

    const user = await this.userRepository.selectUserByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (await this.userRepository.selectUserByNickname(nickname)) {
      throw new ConflictException('This nickname is already in use.');
    }

    const updatedUser = await this.userRepository.updateUserByUserIdx({
      userIdx,
      nickname,
    });

    return UserInfoEntity.createEntityFromPrisma(updatedUser);
  }

  /**
   * 프로필 이미지 수정 (S3 업로드 & DB 업데이트)
   *
   * @author 조희주
   */
  async updateProfileImageByUserIdx(
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<UserInfoEntity> {
    const user = await this.userRepository.selectUserByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const imageKey = await this.s3Service.uploadFile(file, S3Folder.PROFILE);

    const updatedUser = await this.userRepository.updateUserByUserIdx({
      userIdx,
      profileImagePath: imageKey,
    });

    return UserInfoEntity.createEntityFromPrisma(updatedUser);
  }

  /**
   * 회원 탈퇴
   *
   * @author 조희주
   */
  async deleteUserByUserIdx(userIdx: number): Promise<void> {
    const user = await this.userRepository.selectUserByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.deleteUserByUserIdx(userIdx);
  }
}
