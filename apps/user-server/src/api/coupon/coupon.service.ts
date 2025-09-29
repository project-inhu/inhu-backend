import { CouponCoreService } from '@libs/core/coupon/coupon-core.service';
import { Injectable } from '@nestjs/common';
import { CouponEntity } from './entity/coupon.entity';
import { CreateCouponDto } from './dto/request/create-coupon.dto';
import { GetCouponAllByPlaceIdxDto } from './dto/request/get-coupon-all-by-place-idx.dto';
import { GetCouponAllByPlaceIdxResponseDto } from './dto/response/get-coupon-all-by-place-idx-response.dto';

@Injectable()
export class CouponService {
  constructor(private readonly couponCoreService: CouponCoreService) {}

  public async getCouponAllByPlaceIdx(
    placeIdx: number,
    dto: GetCouponAllByPlaceIdxDto,
  ): Promise<GetCouponAllByPlaceIdxResponseDto> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;

    const couponModelList = await this.couponCoreService.getCouponAllByPlaceIdx(
      placeIdx,
      {
        take: pageSize + 1,
        skip: skip,
      },
    );

    const paginatedList = couponModelList.slice(0, pageSize);
    const hasNext = couponModelList.length > pageSize;

    return {
      hasNext: hasNext,
      couponList: paginatedList.map((coupon) => CouponEntity.fromModel(coupon)),
    };
  }

  public async createCoupon(
    dto: CreateCouponDto,
    placeIdx: number,
  ): Promise<void> {
    return await this.couponCoreService.createCoupon(
      {
        description: dto.description,
        imagePath: dto.imagePath,
        expiredAt: dto.expiredAt,
        usablePlaceIdx: placeIdx,
        fixedDiscount: dto.fixedDiscount ?? undefined,
        percentDiscount: dto.percentDiscount ?? undefined,
        etc: dto.etc ?? undefined,
      },
      dto.count,
    );
  }

  public async deleteCouponAllByBundleId(bundleId: string): Promise<void> {
    await this.couponCoreService.deleteCouponAllByBundleId(bundleId);
  }
}
