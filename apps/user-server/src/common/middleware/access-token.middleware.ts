import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';
import { NextFunction, Request } from 'express';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly loginTokenService: LoginTokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = this.extractAccessToken(req);

    if (!accessToken) {
      return next();
    }

    const payload = await this.loginTokenService.verifyAccessToken(accessToken);
    (req as any).user = payload;

    next();
  }

  private extractAccessToken(req: Request): string | null {
    const token = req.headers.authorization;

    if (!token) {
      return null;
    }

    const [type, accessToken] = token.split(' ');

    if (type !== 'Bearer' || !accessToken) {
      return null;
    }

    return accessToken;
  }
}
