import { Module } from '@nestjs/common';
import { CouponCoreService } from './coupon-core.service';
import { CouponCoreRepository } from './coupon-core.repository';

@Module({
  providers: [CouponCoreService, CouponCoreRepository],
  exports: [CouponCoreService],
})
export class CouponCoreModule {}
