import { CouponTemplateCoreModule } from '@libs/core/coupon-template/coupon-template-core.module';
import { CouponTemplateController } from './coupon-template.controller';
import { CouponTemplateService } from './coupon-template.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [CouponTemplateCoreModule],
  controllers: [CouponTemplateController],
  providers: [CouponTemplateService],
  exports: [CouponTemplateService],
})
export class CouponTemplateModule {}
