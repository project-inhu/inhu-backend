import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Refresh Token을 검증하여 payload를 반환한다.
   * 만약 토큰이 유효하지 않거나, `idx`가 없다면 예외를 발생시킨다.
   *
   * @param token 검증할 Refresh Token
   * @returns 검증된 토큰의 payload
   * @throws UnauthorizedException 토큰이 만료되었거나, 유효하지 않은 경우
   *
   * @author 이수인
   */
  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (!payload.idx) {
        throw new UnauthorizedException('invalid token');
      }

      const { exp, iat, ...newPayload } = payload;

      return newPayload;
    } catch (err) {
      throw new UnauthorizedException('refresh Token expired');
    }
  }

  /**
   * Access Token을 검증하고 payload를 반환한다.
   * 만료된 경우 예외를 던지지 않고 `null`을 반환한다.
   *
   * @param token 검증할 Access Token
   * @returns 검증된 payload 또는 `null` (만료된 경우)
   *
   * @author 이수인
   */
  async verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (!payload.idx) {
        throw new UnauthorizedException('invalid token');
      }

      return payload;
    } catch (err) {
      return null;
    }
  }

  /**
   * 주어진 payload로 Access Token을 생성한다.
   *
   * @param payload Access Token에 포함할 정보
   * @returns 생성된 JWT Access Token
   * @throws Error 토큰 생성에 실패한 경우
   *
   * @author 이수인
   */
  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload, { expiresIn: '3s' });
    if (!token) {
      throw new Error('not implement');
    }

    return token;
  }

  /**
   * 주어진 payload로 Refresh Token을 생성한다.
   *
   * @param payload Refresh Token에 포함할 정보
   * @returns 생성된 JWT Refresh Token
   * @throws Error 토큰 생성에 실패한 경우
   */
  async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1m' });
    if (!token) {
      throw new Error('not implement');
    }

    return token;
  }
}
