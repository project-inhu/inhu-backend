import { Injectable } from '@nestjs/common';
import { CouponTemplateModel } from './model/coupon-template.model';
import { CreateCouponTemplateInput } from './inputs/create-coupon-template.input';
import { UpdateCouponTemplateInput } from './inputs/update-coupon-template.input';
import { CouponTemplateCoreRepository } from './coupon-template-core.repository';

@Injectable()
export class CouponTemplateCoreService {
  constructor(
    private readonly couponTemplateCoreRepository: CouponTemplateCoreRepository,
  ) {}

  public async getCouponTemplateAllByPlaceIdx(
    placeIdx: number,
  ): Promise<CouponTemplateModel[]> {
    return await this.couponTemplateCoreRepository
      .getCouponTemplateAllByPlaceIdx(placeIdx)
      .then((templates) => templates.map(CouponTemplateModel.fromPrisma));
  }

  public async createCouponTemplate(
    input: CreateCouponTemplateInput,
  ): Promise<CouponTemplateModel> {
    return CouponTemplateModel.fromPrisma(
      await this.couponTemplateCoreRepository.insertCouponTemplate(input),
    );
  }

  public async updateCouponTemplateById(
    id: string,
    input: UpdateCouponTemplateInput,
  ): Promise<void> {
    await this.couponTemplateCoreRepository.updateCouponTemplateById(id, input);
  }
}
