import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/services/auth.service';
import { LoginTokenService } from 'src/auth/services/login-token.service';

/**
 * AuthGuard: 인증을 검증하는 가드 클래스
 * @description 요청이 보호된 API에 접근할 때 인증을 확인하며, Access Token을 검증하고 필요 시 갱신
 *
 * @author 이수인
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly loginTokenService: LoginTokenService,
    private readonly authService: AuthService,
  ) {}

  /**
   * @method canActivate
   * @description 인증 절차를 수행하고, 요청을 진행할 수 있는지(true/false)를 반환
   * @param context - 요청의 실행 컨텍스트
   * @returns Promise<boolean> - 인증 성공 여부
   *
   * @author 이수인
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const accessToken = request.cookies?.accessToken ?? null;
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    const payload = await this.loginTokenService.verifyAccessToken(accessToken);
    if (!payload) {
      const newAccessToken =
        await this.authService.regenerateAccessTokenFromRefreshToken(
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
