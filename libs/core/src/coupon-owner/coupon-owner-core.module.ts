import { Module } from '@nestjs/common';
import { CouponOwnerCoreService } from './coupon-owner-core.service';
import { CouponOwnerCoreRepository } from './coupon-owner-core.repository';

@Module({
  imports: [],
  providers: [CouponOwnerCoreService, CouponOwnerCoreRepository],
  exports: [CouponOwnerCoreService],
})
export class CouponOwnerCoreModule {}
