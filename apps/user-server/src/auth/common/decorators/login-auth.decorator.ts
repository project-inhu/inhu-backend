import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ApiResponse } from '@nestjs/swagger';

/**
 * 로그인 인증이 필요한 요청을 보호하는 데코레이터
 * 실패 시 401 응답 반환
 *
 * @author 강정연
 */
export const LoginAuth = applyDecorators(
  UseGuards(AuthGuard),
  ApiResponse({ status: 401, description: 'token not provided or expired' }),
);
