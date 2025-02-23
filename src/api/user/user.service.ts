import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';
import { GetMyInfoResponseDto } from './dto/user-info-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  /**
   * 소셜 로그인 후 사용자 조회 및 등록
   *
   * @author 조희주
   */
  async registerUser(
    userInfo: SocialUserInfoDto,
  ): Promise<RegisterUserResponseDto> {
    const snsId = userInfo.id;
    const provider = userInfo.provider;

    const user = await this.userRepository.selectUserBySnsId(snsId);
    if (user) {
      return { idx: user.idx };
    }

    const newUser = await this.userRepository.insertUser(snsId, provider);
    return { idx: newUser.idx };
  }

  /**
   * 내 프로필 조회 (프로필 이미지, 닉네임)
   *
   * @author 조희주
   */
  async getMyInfoByUserIdx(idx: number): Promise<GetMyInfoResponseDto> {
    return await this.userRepository.selectUserInfoByUserIdx(idx);
  }
}
