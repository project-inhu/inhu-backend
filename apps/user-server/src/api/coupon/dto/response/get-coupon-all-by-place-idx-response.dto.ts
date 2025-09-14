import { CouponEntity } from '../../entity/coupon.entity';

export class GetCouponAllByPlaceIdxResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 쿠폰 리스트
   */
  couponList: CouponEntity[];
}
