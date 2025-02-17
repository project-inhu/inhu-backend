import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { LoginTokenService } from '../../service/token.service';
import { AuthService } from '../../service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly loginTokenService: LoginTokenService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const accessToken = request.cookies?.accessToken ?? null;
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.loginTokenService.verifyAccessToken(accessToken);
    if (!payload) {
      const newAccessToken =
        await this.authService.makeNewAccessTokenFromRefreshToken(
          request.cookies?.refreshToken,
        );

      response.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
      });
    }
    request['user'] = payload;

    return true;
  }
}
