export class CreateCouponDto {
  /**
   * 쿠폰 추가 설명
   *
   * @example '2인 이상 방문 시 사용 가능'
   */
  description: string | null;

  /**
   * 쿠폰 이미지 경로
   *
   * @example '/menu/00001.png'
   */
  imagePath: string | null;

  /**
   * 쿠폰 만료일
   *
   * @example '2024-12-31T23:59:59.000Z'
   */
  expiredAt: Date;

  /**
   * 고정 할인 쿠폰 정보
   *
   * @example 'null'
   */
  fixedDiscount?: {
    menuName: string;
    price: number;
  };

  /**
   * 퍼센트 할인 쿠폰 정보
   *
   * @example 'null'
   */
  percentDiscount?: {
    menuName: string;
    percent: number;
    maxPrice: number | null;
  };

  /**
   * 기타 쿠폰 정보
   *
   * @example { name: '토핑 무료 쿠폰' }
   */
  variant?: {
    name: string;
  };

  /**
   * 발급 수량
   *
   * @example 100
   */
  count: number;
}
