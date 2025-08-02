import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

/**
 * 상태코드와 메시지를 반환하는 예외 응답 데코레이터
 *
 * @publicApi
 */
export const Exception = (status: number, message: string) =>
  applyDecorators(ApiResponse({ status, description: message }));
