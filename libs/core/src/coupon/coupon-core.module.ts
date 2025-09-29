import { Module } from '@nestjs/common';
import { CouponCoreService } from './coupon-core.service';
import { CouponCoreRepository } from './coupon-core.repository';
import { DateUtilModule } from '@libs/common/modules/date-util/date-util.module';

@Module({
  imports: [DateUtilModule],
  providers: [CouponCoreService, CouponCoreRepository],
  exports: [CouponCoreService],
})
export class CouponCoreModule {}
