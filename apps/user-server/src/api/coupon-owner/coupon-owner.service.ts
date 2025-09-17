import { CouponOwnerCoreService } from '@libs/core/coupon-owner/coupon-owner-core.service';
import { Injectable } from '@nestjs/common';
import { GetOwnedCouponAllByUserIdxDto } from './dto/request/get-owned-coupon-all-by-user-idx.dto';
import { GetOwnedCouponAllByUserIdxResponseDto } from './dto/response/get-owned-coupon-all-by-user-idx-response.dto';
import { OwnedCouponEntity } from './entity/owned-coupon.entity';
import { CouponOwnerEntity } from './entity/coupon-owner.entity';
import { CreateCouponOwnerDto } from './dto/request/create-coupon-owner.dto';

@Injectable()
export class CouponOwnerService {
  constructor(
    private readonly couponOwnerCoreService: CouponOwnerCoreService,
  ) {}

  public async getOwnedCouponAllByUserIdx(
    userIdx: number,
    dto: GetOwnedCouponAllByUserIdxDto,
  ): Promise<GetOwnedCouponAllByUserIdxResponseDto> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;

    const couponOwnerModelList =
      await this.couponOwnerCoreService.getOwnedCouponAllByUserIdx(userIdx, {
        take: pageSize + 1,
        skip: skip,
      });

    const paginatedList = couponOwnerModelList.slice(0, pageSize);
    const hasNext = couponOwnerModelList.length > pageSize;

    return {
      hasNext: hasNext,
      ownedCouponList: paginatedList.map((coupon) =>
        OwnedCouponEntity.fromModel(coupon),
      ),
    };
  }

  public async createCouponOwner(
    dto: CreateCouponOwnerDto,
    userIdx: number,
  ): Promise<CouponOwnerEntity> {
    return this.couponOwnerCoreService
      .createCouponOwner({
        couponId: dto.couponId,
        userIdx: userIdx,
      })
      .then(CouponOwnerEntity.fromModel);
  }
}
