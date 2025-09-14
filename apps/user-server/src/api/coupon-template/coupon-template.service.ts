import { CouponTemplateCoreService } from '@libs/core/coupon-template/coupon-template-core.service';
import { Injectable } from '@nestjs/common';
import { CouponTemplateEntity } from './entity/coupon-template.entity';
import { CreateCouponTemplateDto } from './dto/request/create-coupon-template.dto';
import { UpdateCouponTemplateDto } from './dto/request/update-coupon-template.dto';

@Injectable()
export class CouponTemplateService {
  constructor(
    private readonly couponTemplateCoreService: CouponTemplateCoreService,
  ) {}

  public async getCouponTemplateAllByPlaceIdx(
    placeIdx: number,
  ): Promise<CouponTemplateEntity[]> {
    return (
      await this.couponTemplateCoreService.getCouponTemplateAllByPlaceIdx(
        placeIdx,
      )
    ).map((couponTemplate) => CouponTemplateEntity.fromModel(couponTemplate));
  }

  public async createCouponTemplate(
    dto: CreateCouponTemplateDto,
    placeIdx: number,
  ): Promise<CouponTemplateEntity> {
    return await this.couponTemplateCoreService
      .createCouponTemplate({
        placeIdx,
        description: dto.description,
        imagePath: dto.imagePath,
        fixedDiscount: dto.fixedDiscount ?? undefined,
        percentDiscount: dto.percentDiscount ?? undefined,
        variant: dto.variant ?? undefined,
      })
      .then(CouponTemplateEntity.fromModel);
  }

  public async updateCouponTemplateById(
    id: string,
    dto: UpdateCouponTemplateDto,
  ): Promise<void> {
    await this.couponTemplateCoreService.updateCouponTemplateById(id, dto);
  }
}
