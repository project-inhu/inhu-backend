import { CouponCoreService } from '@libs/core/coupon/coupon-core.service';
import { Injectable } from '@nestjs/common';
import { CouponEntity } from './entity/coupon.entity';
import { CreateCouponDto } from './dto/request/create-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private readonly couponCoreService: CouponCoreService) {}

  public async getCouponAllByPlaceIdx(
    placeIdx: number,
  ): Promise<CouponEntity[]> {
    return (await this.couponCoreService.getCouponAllByPlaceIdx(placeIdx)).map(
      (coupon) => CouponEntity.fromModel(coupon),
    );
  }

  public async createCoupon(
    dto: CreateCouponDto,
    placeIdx: number,
  ): Promise<CouponEntity[]> {
    return (
      await this.couponCoreService.createCoupon(
        {
          description: dto.description,
          imagePath: dto.imagePath,
          expiredAt: dto.expiredAt,
          usablePlaceIdx: placeIdx,
          fixedDiscount: dto.fixedDiscount ?? undefined,
          percentDiscount: dto.percentDiscount ?? undefined,
          variant: dto.variant ?? undefined,
        },
        dto.count,
      )
    ).map((coupon) => CouponEntity.fromModel(coupon));
  }
}
