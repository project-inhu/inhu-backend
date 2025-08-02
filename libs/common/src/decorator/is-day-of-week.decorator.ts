import { dayOfWeeks } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { applyDecorators } from '@nestjs/common';
import { IsIn, ValidationOptions } from 'class-validator';

/**
 * 요일을 검증하는 데코레이터입니다.
 *
 * @publicApi
 */
export const IsDayOfWeek = (options?: ValidationOptions) =>
  applyDecorators(IsIn(Object.values(dayOfWeeks), options));
