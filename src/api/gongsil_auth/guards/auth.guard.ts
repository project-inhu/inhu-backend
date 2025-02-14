import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
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
    console.log('가드쿠키', request.headers.cookie);

    const token = request.cookies['AccessToken'];
    if (!token) {
      throw new UnauthorizedException('Access Token이 없습니다.');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('재발급 요청');
        // 자동으로 refresh API 호출출
        try {
          await axios.get('http://localhost:3000/auth/refresh', {
            headers: { Cookie: request.headers.cookie }, // 쿠키를 그대로 저장장
            withCredentials: true, // 쿠키를 포함
          });
          return true;
        } catch (error) {
          throw new UnauthorizedException('토큰 갱신 실패');
        }
      }
      throw new UnauthorizedException('유효하지 않은 Access Token입니다.');
    }
    return true;
  }
}
