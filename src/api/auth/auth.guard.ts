import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // @Public() 데코레이터가 붙어 있으면 인증 없이 접근 허용하기 위함
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // 현재 실행중인 메서드에 설정된 메타데이터 가져오기
      context.getClass(), // 현재 컨트롤러 클래스에 설정된 메타데이터 가져오기
    ]);
    if (isPublic) {
      // 그 안의 메타데이터가 true일 경우
      return true; // 바로 통과시키기
    }

    const request = context.switchToHttp().getRequest(); // http 요청 객체 가져오기
    const token = this.extractTokenFromHeader(request); // Authorization 헤더에서 JWT 토큰 추출

    if (!token) {
      // 토큰 없을시 401
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        // payload 추출
        secret: process.env.JWT_SECRET,
      });

      request['user'] = payload; // user에 담음 -> req.user
    } catch {
      throw new UnauthorizedException();
    }

    return true; // 성공하면 통과시킴
  }

  // Bearer 형식만 허용하도록함
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
