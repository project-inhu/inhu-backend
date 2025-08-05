import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { applyDecorators } from '@nestjs/common';
import { ValidationOptions } from 'class-validator';
import { IsEnumValue } from './is-enum-value.decorator';

/**
 * 요일을 검증하는 데코레이터입니다.
 *
 * @publicApi
 */
export const IsDayOfWeek = (options?: ValidationOptions) =>
  applyDecorators(IsEnumValue(DayOfWeek, options));
