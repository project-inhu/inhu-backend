import { CouponPercentDiscountModel } from './coupon-percent-discount.model';
import { CouponFixedDiscountModel } from './coupon-fixed-discount.model';
import { SelectCoupon } from './prisma-type/select-coupon';
import { CouponPlaceModel } from './coupon-place.model';
import { CouponEtcModel } from './coupon-etc.model';
import { CouponType } from '../constants/coupon-type.enum';

/**
 * 쿠폰 모델
 *
 * @publicApi
 */
export class CouponModel {
  /**
   * 쿠폰 ID
   */
  public id: string;

  /**
   * 쿠폰 묶음 ID
   */
  public bundleId: string;

  /**
   * 쿠폰 추가 설명
   */
  public description: string | null;

  /**
   * 쿠폰 이미지 경로
   */
  public imagePath: string | null;

  /**
   * 생성 일시
   */
  public createdAt: Date;

  /**
   * 활성화 일시
   */
  public activatedAt: Date;

  /**
   * 만료 일시
   */
  public expiredAt: Date;

  /**
   * 사용 일시
   */
  public usedAt: Date | null;

  /**
   * 고정 할인 쿠폰 정보
   */
  public fixedDiscount: CouponFixedDiscountModel | null;

  /**
   * 퍼센트 할인 쿠폰 정보
   */
  public percentDiscount: CouponPercentDiscountModel | null;

  /**
   * 기타 쿠폰 정보
   */
  public etc: CouponEtcModel | null;

  /**
   * 쿠폰 사용처 정보
   */
  public place: CouponPlaceModel;

  /**
   * 쿠폰 타입
   */
  public type: CouponType;

  constructor(data: CouponModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(coupon: SelectCoupon): CouponModel {
    return new CouponModel({
      id: coupon.id,
      bundleId: coupon.bundleId,
      description: coupon.description,
      imagePath: coupon.imagePath,
      createdAt: coupon.createdAt,
      activatedAt: coupon.activatedAt,
      expiredAt: coupon.expiredAt,
      usedAt: coupon.usedAt,
      fixedDiscount: coupon.fixedDiscount
        ? CouponFixedDiscountModel.fromPrisma(coupon.fixedDiscount)
        : null,
      percentDiscount: coupon.percentDiscount
        ? CouponPercentDiscountModel.fromPrisma(coupon.percentDiscount)
        : null,
      etc: coupon.etc ? CouponEtcModel.fromPrisma(coupon.etc) : null,
      place: CouponPlaceModel.fromPrisma(coupon.place),
      type: coupon.fixedDiscount
        ? CouponType.FIXED_DISCOUNT
        : coupon.percentDiscount
          ? CouponType.PERCENT_DISCOUNT
          : CouponType.ETC,
    });
  }
}
