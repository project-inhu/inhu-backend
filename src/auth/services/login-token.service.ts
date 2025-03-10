import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Refresh Token을 검증하고, 유효한 경우 payload를 반환
   *
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
   * Access Token을 검증하고, 만료되지 않은 경우 payload를 반환
   *
   * @returns 검증된 payload 또는 만료된 경우 예외를 던지지 않고 null을 반환
   *
   * @author 이수인
   */
  async verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (!payload.idx) {
        throw new UnauthorizedException('invalid token');
      }

      const { exp, iat, ...newPayload } = payload;

      return newPayload;
    } catch (err) {
      return null;
    }
  }

  /**
   * 주어진 payload로 Access Token을 생성
   *
   * @author 이수인
   */
  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
    });
    if (!token) {
      throw new Error('not implement');
    }

    return token;
  }
  /**
   * 주어진 payload로 Refresh Token을 생성한다.
   *
   * @author 이수인
   */
  async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    if (!token) {
      throw new Error('not implement');
    }

    return token;
  }
}
