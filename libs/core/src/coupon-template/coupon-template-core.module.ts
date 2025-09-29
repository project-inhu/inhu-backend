import { Module } from '@nestjs/common';
import { CouponTemplateCoreService } from './coupon-template-core.service';
import { CouponTemplateCoreRepository } from './coupon-template-core.repository';

@Module({
  providers: [CouponTemplateCoreService, CouponTemplateCoreRepository],
  exports: [CouponTemplateCoreService],
})
export class CouponTemplateCoreModule {}
