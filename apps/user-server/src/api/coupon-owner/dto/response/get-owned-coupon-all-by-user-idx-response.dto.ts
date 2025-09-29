import { OwnedCouponEntity } from '../../entity/owned-coupon.entity';

export class GetOwnedCouponAllByUserIdxResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 보유 쿠폰 목록 data
   */
  ownedCouponList: OwnedCouponEntity[];
}
