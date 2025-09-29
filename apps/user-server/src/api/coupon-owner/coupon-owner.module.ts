import { Module } from '@nestjs/common';
import { CouponOwnerController } from './coupon-owner.controller';
import { CouponOwnerService } from './coupon-owner.service';
import { CouponOwnerCoreModule } from '@libs/core/coupon-owner/coupon-owner-core.module';

@Module({
  imports: [CouponOwnerCoreModule],
  controllers: [CouponOwnerController],
  providers: [CouponOwnerService],
  exports: [CouponOwnerService],
})
export class CouponOwnerModule {}
