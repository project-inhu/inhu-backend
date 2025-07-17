import { Module } from '@nestjs/common';
import { DateUtilService } from '@user/common/module/date-util/date-util.service';

@Module({ providers: [DateUtilService], exports: [DateUtilService] })
export class DateUtilModule {}
