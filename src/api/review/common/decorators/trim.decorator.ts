import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

/**
 * 문자열의 앞뒤 공백을 제거하는 Trim 데코레이터
 */
export function Trim() {
  return applyDecorators(Transform(({ value }) => value.trim()));
}
