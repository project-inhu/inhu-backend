import { Injectable } from '@nestjs/common';
import { CouponTemplateModel } from './model/coupon-template.model';
import { CreateCouponTemplateInput } from './inputs/create-coupon-template.input';
import { UpdateCouponTemplateInput } from './inputs/update-coupon-template.input';
import { CouponTemplateCoreRepository } from './coupon-template-core.repository';
import { GetCouponTemplateAllByPlaceIdxInput } from './inputs/get-coupon-template-all-by-place-idx.input';

@Injectable()
export class CouponTemplateCoreService {
  constructor(
    private readonly couponTemplateCoreRepository: CouponTemplateCoreRepository,
  ) {}

  public async getCouponTemplateAllByPlaceIdx(
    placeIdx: number,
    input: GetCouponTemplateAllByPlaceIdxInput,
  ): Promise<CouponTemplateModel[]> {
    return await this.couponTemplateCoreRepository
      .getCouponTemplateAllByPlaceIdx(placeIdx, input)
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

  public async deleteCouponTemplateById(id: string): Promise<void> {
    await this.couponTemplateCoreRepository.deleteCouponTemplateById(id);
  }
}
