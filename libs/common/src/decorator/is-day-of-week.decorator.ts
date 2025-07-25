import { dayOfWeeks } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { applyDecorators } from '@nestjs/common';
import { IsIn, ValidationOptions } from 'class-validator';

export const IsDayOfWeek = (options?: ValidationOptions) =>
  applyDecorators(IsIn(Object.values(dayOfWeeks), options));
