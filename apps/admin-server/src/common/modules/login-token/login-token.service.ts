import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InvalidLoginTokenException } from 'apps/admin-server/src/common/modules/login-token/exception/invalid-login-token.exception';
import { TokenPayload } from 'apps/admin-server/src/common/modules/login-token/types/TokenPayload';

@Injectable()
export class LoginTokenService {
  private readonly TOKEN_SECRET: string;
  private readonly TOKEN_EXPIRATION: number;

  constructor(
    configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const config = configService.get('jwt');

    this.TOKEN_SECRET = config.secret;
    this.TOKEN_EXPIRATION = config.expiresIn;
  }

  public async generateAdminToken(userIdx: number): Promise<string> {
    const tokenPayload: TokenPayload = {
      idx: userIdx,
    };

    return await this.jwtService.signAsync(tokenPayload, {
      expiresIn: this.TOKEN_EXPIRATION,
    });
  }

  public async verifyAdminToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.TOKEN_SECRET,
      });
    } catch (error) {
      throw new InvalidLoginTokenException('Invalid or expired token');
    }
  }
}
