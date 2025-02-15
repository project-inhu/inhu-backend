import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(idx: number): Promise<string> {
    const payload = {
      sub: idx,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '5s',
    });
  }

  async generateRefreshToken(idx: number): Promise<string> {
    const payload = {
      sub: idx,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  async verifyRefreshToken(
    serverRefreshToken: string,
  ): Promise<DecodedJwtPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync(serverRefreshToken);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
