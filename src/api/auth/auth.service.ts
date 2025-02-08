import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { KakaoAccessTokenDto, KakaoUserInfoDto } from './dto/kakao.dto';
import { LoginResponseDto, UserProviderDto } from './dto/auth.dto';
import { AuthRepository } from './auth.repository';

// TODO :  개방 폐쇄 원칙 반영하여 코드 리팩토링 / refresh token 생각하기
// TODO : 랜덤 닉네임 생성 함수 만들고 UserDto 변수명 생각하기

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository
  ) {}

  async loginWithKakao(code: string): Promise<LoginResponseDto> {
    // 1. 카카오 API를 통해 Access Token 가져오기
    const accessToken = await this.getKakaoAccessToken(code);
    //console.log("accessToken : ", accessToken)

    // 2. Access Token으로 카카오 사용자 정보 가져오기
    const userInfo = await this.getKakaoUserInfo(accessToken.access_token);
    //console.log("userInfo : ", userInfo)

    // 3. 유저 정보 조회 및 신규 유저 등록 -> db에 저장된 현재 유저 정보 return
    const registeredUser = await this.registerUser(userInfo);
    //console.log("userProvider : ", registeredUser)

    // 4. JWT 발급
    const jwtToken = this.generateJwtToken(registeredUser.idx);
    //console.log("jwtToken : ", jwtToken)

    return { accessToken: jwtToken };
  }

  private async getKakaoAccessToken(code: string): Promise<KakaoAccessTokenDto> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.KAKAO_CLIENT_ID || '');
    params.append('redirect_uri', process.env.KAKAO_REDIRECT_URI || '');
    params.append('code', code);

    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      ),
    );

    return tokenResponse.data;
  }

  private async getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfoDto> {
    const userInfoResponse = await firstValueFrom(
      this.httpService.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return userInfoResponse.data;
  }

  private async registerUser(userInfo: KakaoUserInfoDto): Promise<UserProviderDto> {
    const snsId = userInfo.id.toString(); // 카카오 고유 식별값 (snsId)
    const provider = 0;
    const nickname = 'random'; // TODO: 랜덤 닉네임 생성 함수 추가

    const existingUserProvider = await this.authRepository.findUser(snsId, provider);

    // 유저가 이미 존재하는 경우 바로 그 유저 반환
    if (existingUserProvider) {
        return existingUserProvider; 
    }

    // 유저가 없다면 DB에 등록 후 유저 반환
    const newUser = await this.authRepository.createUser(nickname);
    return await this.authRepository.createUserProvider(snsId, provider, newUser.idx);
}

  private generateJwtToken(idx: number): string {
    const payload = { idx };
    return this.jwtService.sign(payload);
  }
}
