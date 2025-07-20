import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenIssuedBy } from '@user/common/module/login-token/constants/token-issued-by.constants';
import { AccessTokenPayload } from '@user/common/module/login-token/types/AccessTokenPayload';
import { Request } from 'express';

@Injectable()
export class AppLoginAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user: AccessTokenPayload = (request as any).user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (user.issuedBy !== TokenIssuedBy.APP) {
      throw new ForbiddenException('Access denied: Invalid token issuer');
    }

    return true;
  }
}
