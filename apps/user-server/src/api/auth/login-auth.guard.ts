import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessTokenPayload } from '@user/common/module/login-token/types/AccessTokenPayload';
import { Request } from 'express';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user: AccessTokenPayload = (request as any).user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return true;
  }
}
