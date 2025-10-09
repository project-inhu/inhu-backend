import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

/**
 * 배열의 중복을 제거하는 데코레이터
 *
 * @author 강정연
 */
export function UniqueArray() {
  return applyDecorators(Transform(({ value }) => [...new Set(value)]));
}
