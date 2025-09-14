import { PartialType } from '@nestjs/swagger';
import { CreateCouponTemplateInput } from './create-coupon-template.input';

export class UpdateCouponTemplateInput extends PartialType(
  CreateCouponTemplateInput,
) {}
