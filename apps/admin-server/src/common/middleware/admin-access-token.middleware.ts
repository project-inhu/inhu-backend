import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoginTokenService } from '../modules/login-token/login-token.service';
import { NextFunction, Request } from 'express';

@Injectable()
export class AdminAccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly loginTokenService: LoginTokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const adminToken = this.extractAccessToken(req);

    if (!adminToken) {
      return next();
    }

    const payload = await this.loginTokenService.verifyAdminToken(adminToken);
    (req as any).admin = payload;

    next();
  }

  private extractAccessToken(req: Request): string | null {
    const token = req.cookies['token'];

    console.log('Extracted token from cookies:', token);

    if (!token) {
      return null;
    }

    const [type, adminToken] = token.split(' ');

    console.log('Token type:', type, 'Admin token:', adminToken);

    if (type !== 'Bearer' || !adminToken) {
      return null;
    }

    return adminToken;
  }
}
