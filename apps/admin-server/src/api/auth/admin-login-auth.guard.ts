import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from '../../common/modules/login-token/types/TokenPayload';

@Injectable()
export class AdminLoginAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const admin: TokenPayload = (request as any).admin;

    if (!admin) {
      throw new UnauthorizedException('Admin not authenticated');
    }

    return true;
  }
}
