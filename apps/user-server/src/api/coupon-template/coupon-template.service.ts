import { CouponTemplateCoreService } from '@libs/core/coupon-template/coupon-template-core.service';
import { Injectable } from '@nestjs/common';
import { CouponTemplateEntity } from './entity/coupon-template.entity';
import { CreateCouponTemplateDto } from './dto/request/create-coupon-template.dto';
import { UpdateCouponTemplateDto } from './dto/request/update-coupon-template.dto';
import { GetCouponTemplateAllByPlaceIdxDto } from './dto/request/get-coupon-template-all-by-place-idx.dto';
import { GetCouponTemplateAllByPlaceIdxResponseDto } from './dto/response/get-coupon-template-all-by-place-idx-response.dto';

@Injectable()
export class CouponTemplateService {
  constructor(
    private readonly couponTemplateCoreService: CouponTemplateCoreService,
  ) {}

  public async getCouponTemplateAllByPlaceIdx(
    dto: GetCouponTemplateAllByPlaceIdxDto,
    placeIdx: number,
  ): Promise<GetCouponTemplateAllByPlaceIdxResponseDto> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;

    const couponTemplateModelList =
      await this.couponTemplateCoreService.getCouponTemplateAllByPlaceIdx(
        placeIdx,
        {
          take: pageSize + 1,
          skip: skip,
        },
      );

    const paginatedList = couponTemplateModelList.slice(0, pageSize);
    const hasNext = couponTemplateModelList.length > pageSize;

    return {
      hasNext: hasNext,
      couponTemplateList: paginatedList.map((couponTemplate) =>
        CouponTemplateEntity.fromModel(couponTemplate),
      ),
    };
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
        etc: dto.etc ?? undefined,
      })
      .then(CouponTemplateEntity.fromModel);
  }

  public async updateCouponTemplateById(
    id: string,
    dto: UpdateCouponTemplateDto,
  ): Promise<void> {
    await this.couponTemplateCoreService.updateCouponTemplateById(id, dto);
  }

  public async deleteCouponTemplateById(id: string): Promise<void> {
    await this.couponTemplateCoreService.deleteCouponTemplateById(id);
  }
}
