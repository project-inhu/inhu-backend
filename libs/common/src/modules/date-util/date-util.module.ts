import { Module } from '@nestjs/common';
import { DateUtilService } from './date-util.service';

/**
 * DateUtil 모듈
 *
 * @publicApi
 */
@Module({
  providers: [DateUtilService],
  exports: [DateUtilService],
})
export class DateUtilModule {}
