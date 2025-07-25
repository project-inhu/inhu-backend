import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@user/auth/services/auth.service';
import { LoginTokenService } from '@user/auth/services/login-token.service';

/**
 * 보호된 API 요청 시 Access Token을 검증하고, 필요하면 새로 갱신하는 인증 가드
 *
 * @author 이수인
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly loginTokenService: LoginTokenService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 요청의 Access Token을 확인하고, 유효하지 않으면 Refresh Token을 사용해 갱신 후 요청을 진행
   *
   * @author 이수인
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const accessToken = request.headers?.authorization?.split(' ')[1] ?? null;
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    let payload = await this.loginTokenService.verifyAccessToken(accessToken);

    if (!payload) {
      throw new UnauthorizedException('Invalid access token');
    }

    request['user'] = payload;

    return true;
  }
}
