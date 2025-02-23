import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { SocialUserInfoDto } from 'src/auth/dto/social-common/social-user-info.dto';

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

  async getMyInfo(idx: number): Promise<UserProfile> {
    return await this.userRepository.selectUserProfileById(idx);
  }
}
