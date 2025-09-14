import { CouponTemplateEntity } from '../../entity/coupon-template.entity';

export class GetCouponTemplateAllByPlaceIdxResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 쿠폰 템플릿 리스트
   */
  couponTemplateList: CouponTemplateEntity[];
}
