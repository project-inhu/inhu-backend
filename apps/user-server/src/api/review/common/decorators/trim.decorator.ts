import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

/**
 * 문자열의 앞뒤 공백을 제거하는 Trim 데코레이터
 *
 * @author 강정연
 */
export function Trim() {
  return applyDecorators(
    Transform(({ value }) =>
      typeof value === 'string' ? value.trim() : value,
    ),
  );
}
