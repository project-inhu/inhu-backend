import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { KakaoAccessTokenDto, KakaoUserInfoDto } from './dto/kakao.dto';
import { AuthTokensDto, UserProviderDto } from './dto/auth.dto';
import { AuthRepository } from './auth.repository';
import { generateRandomNickname } from './utils/random-nickname.util';

// TODO : regenerateToken 안에서 accessToken, refreshToken 만료됐는지 확인하지말고 auth guard에서 확인하도록 하기? -> accessToken은 만료 안됐는데 refreshToken은 만료되는 경우도 있을 수 있으므로
// TODO : try catch, 오류 제어 부분 보충
// TODO(Later) : 개방 폐쇄 원칙 반영하여 코드 리팩토링
// Q. auth.dtod의 UserDto, UserProviderDTO는 user-info.dto에 있어야하는가?

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository
  ) {}

  async loginWithKakao(code: string): Promise<AuthTokensDto> {
    // 1. 카카오 API를 통해 Access Token 가져오기
    const accessToken = await this.getKakaoAccessToken(code);

    // 2. Access Token으로 카카오 사용자 정보 가져오기
    const userInfo = await this.getKakaoUserInfo(accessToken.access_token);

    // 3. 유저 정보 조회 및 신규 유저 등록 -> db에 저장된 현재 유저 정보 return
    const registeredUser = await this.registerUser(userInfo);

    // 4. JWT 발급 (Access + Refresh)
    const jwtAccessToken = this.generateToken(registeredUser.idx, 'access');
    const jwtRefreshToken = this.generateToken(registeredUser.idx, 'refresh');

    // Refresh Token은 DB에 저장
    await this.authRepository.updateRefreshToken(registeredUser.idx, jwtRefreshToken);

    return { jwtAccessToken, jwtRefreshToken };
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
    const provider = 0; // 현재는 카카오만 고려하고 있으므로 임시로 0으로 고정
    const nickname = generateRandomNickname(); // 랜덤 닉네임 생성

    const existingUserProvider = await this.authRepository.findUser(snsId, provider);

    // 유저가 이미 존재하는 경우 바로 그 유저 반환
    if (existingUserProvider) {
        return existingUserProvider; 
    }

    // 유저가 없다면 DB에 등록 후 유저 반환
    const newUser = await this.authRepository.createUser(nickname);
    return await this.authRepository.createUserProvider(snsId, provider, newUser.idx);
}

  async regenerateToken(userIdx: number, refreshToken: string): Promise<AuthTokensDto> {
      const storedToken = await this.authRepository.getRefreshToken(userIdx);

      if (!storedToken || storedToken !== refreshToken) {
          throw new UnauthorizedException('유효하지 않은 refresh token');
      }

      try {
          // refresh Token 검증 및 만료 여부 확인
          const decoded = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });

          if (!decoded || !decoded.exp) {
              throw new UnauthorizedException('잘못된 refresh token');
          }

          // 현재 시간과 만료 시간 비교
          const now = Math.floor(Date.now() / 1000); // 현재 시간 (초)
          const isRefreshTokenExpired = decoded.exp < now;

          // regenerateToken 함수 호출시 무조건 Access Token은 재발급
          const newJwtAccessToken = this.generateToken(userIdx, 'access');
          let newJwtRefreshToken = refreshToken;

          // 만약 refresh Token도 만료되었다면 새로 발급
          if (isRefreshTokenExpired) {
              newJwtRefreshToken = this.generateToken(userIdx, 'refresh');
              await this.authRepository.updateRefreshToken(userIdx, newJwtRefreshToken);
          }

          return { jwtAccessToken: newJwtAccessToken, jwtRefreshToken: newJwtRefreshToken };
      } catch (error) {
          throw new UnauthorizedException('Refresh Token이 유효하지 않음');
      }
  }

  
  private generateToken(idx: number, type: 'access' | 'refresh'): string {
    return this.jwtService.sign(
      { idx },
      {
        expiresIn: type === 'access' ? '1h' : '7d',
        secret: process.env.JWT_SECRET,
      },
    );
  }

}
