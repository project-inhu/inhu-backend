import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserInfoEntity } from './entity/user-info.entity';
import { CreateUserEntity } from './entity/create-user.entity';
import { CreateUserInput } from './input/create-user.input';
import { S3Service } from '@user/common/module/s3/s3.service';
import { S3Folder } from '@user/common/module/s3/enums/s3-folder.enum';
import { UpdateUserInput } from './input/update-user.input';
import { UpdateProfileImageInput } from './input/update-profile-image.input';
import { GetPresignedUrlResponseDto } from '@user/common/module/s3/dto/get-presigned-url-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly s3Service: S3Service) {}

  // /**
  //  * 새로운 사용자를 위한 임시 닉네임 생성
  //  *
  //  * @author 조희주
  //  */
  // async generateTemporaryNickname(): Promise<string> {
  //   const maxIdx = await this.userRepository.getMaxUserIdx();
  //   return `${maxIdx + 1}번째 인후러`;
  // }

  // /**
  //  * 소셜 로그인 후 사용자 조회 및 등록
  //  *
  //  * @author 조희주
  //  */
  // async createUser(
  //   createUserInput: CreateUserInput,
  // ): Promise<CreateUserEntity> {
  //   const { snsId, provider } = createUserInput;

  //   const user = await this.userRepository.selectUserBySnsId(snsId);
  //   if (user) {
  //     return CreateUserEntity.createEntityFromPrisma(user);
  //   }

  //   const nickname = await this.generateTemporaryNickname();

  //   const createUserData = {
  //     snsId,
  //     provider,
  //     nickname,
  //   };

  //   const newUser = await this.userRepository.createUser(createUserData);

  //   return CreateUserEntity.createEntityFromPrisma(newUser);
  // }

  // /**
  //  * 내 정보 조회
  //  *
  //  * @author 조희주
  //  */
  // async getUserByUserIdx(userIdx: number): Promise<UserInfoEntity> {
  //   const user = await this.userRepository.selectUserByUserIdx(userIdx);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   return UserInfoEntity.createEntityFromPrisma(user);
  // }

  // /**
  //  * 닉네임 수정
  //  *
  //  * @author 조희주
  //  */
  // async updateNicknameByUserIdx(
  //   updateNicknameInput: UpdateUserInput,
  // ): Promise<UserInfoEntity> {
  //   const { userIdx, nickname } = updateNicknameInput;

  //   if (!nickname) {
  //     throw new BadRequestException('You need nickname.');
  //   }

  //   const user = await this.userRepository.selectUserByUserIdx(userIdx);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   if (await this.userRepository.selectUserByNickname(nickname)) {
  //     throw new ConflictException('This nickname is already in use.');
  //   }

  //   const updatedUser = await this.userRepository.updateUserByUserIdx({
  //     userIdx,
  //     nickname,
  //   });

  //   return UserInfoEntity.createEntityFromPrisma(updatedUser);
  // }

  // /**
  //  * 프로필 이미지 업로드를 위한 Presigned URL 생성
  //  *
  //  * @author 조희주
  //  */
  // async getPresignedUrl(filename: string): Promise<GetPresignedUrlResponseDto> {
  //   return this.s3Service.getPresignedUrl({
  //     folder: S3Folder.PROFILE,
  //     filename: filename,
  //   });
  // }

  // /**
  //  * S3 업로드 후 파일 키를 DB에 저장
  //  *
  //  * @author 조희주
  //  */
  // async updateProfileImagePathByUserIdx(
  //   updateProfileImageInput: UpdateProfileImageInput,
  // ): Promise<UserInfoEntity> {
  //   const { userIdx, imageKey } = updateProfileImageInput;

  //   const user = await this.userRepository.selectUserByUserIdx(userIdx);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const updatedUser = await this.userRepository.updateUserByUserIdx({
  //     userIdx,
  //     profileImagePath: imageKey,
  //   });

  //   return UserInfoEntity.createEntityFromPrisma(updatedUser);
  // }

  // /**
  //  * 회원 탈퇴
  //  *
  //  * @author 조희주
  //  */
  // async deleteUserByUserIdx(userIdx: number): Promise<void> {
  //   const user = await this.userRepository.selectUserByUserIdx(userIdx);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   await this.userRepository.deleteUserByUserIdx(userIdx);
  // }
}
