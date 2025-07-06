import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginTokenService } from '../../services/login-token.service';
import { TokenStorageStrategy } from '../base/token-storage.strategy';

@Injectable()
export class InMemoryTokenStorage extends TokenStorageStrategy {
  /**
   * Refresh Token을 서버 메모리에서 관리 (DB 저장 X)
   * - key: userIdx
   * - value: refreshToken (string)
   */
  private readonly REFRESH_TOKEN_STORE: Record<number, string> = {};

  constructor(private readonly loginTokenService: LoginTokenService) {
    super();
  }

  /**
   * Refresh Token 메모리에 저장
   *
   * @author 이수인
   */
  public saveRefreshToken(userIdx: number, refreshToken: string): void {
    this.REFRESH_TOKEN_STORE[userIdx] = refreshToken;
  }

  /**
   * Refresh Token 조회
   *
   * @author 이수인
   */
  public getRefreshToken(userIdx: number): string | null {
    return this.REFRESH_TOKEN_STORE[userIdx] || null;
  }

  /**
   * Refresh Token 검증 후 새로운 Access Token 발급
   *
   * @author 이수인
   */
  public async regenerateAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    const payload =
      await this.loginTokenService.verifyRefreshToken(refreshToken);

    if (this.isRefreshTokenInvalid(payload, refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return await this.loginTokenService.signAccessToken(payload);
  }

  protected isRefreshTokenInvalid(
    payload: RefreshTokenPayload,
    refreshToken: string,
  ): boolean {
    return (
      !this.getRefreshToken(payload.idx) ||
      this.getRefreshToken(payload.idx) !== refreshToken
    );
  }
}
