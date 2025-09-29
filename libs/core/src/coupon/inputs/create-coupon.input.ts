/**
 * 쿠폰 생성 input
 *
 * @publicApi
 */
export class CreateCouponInput {
  description: string | null;
  imagePath: string | null;
  expiredAt: Date;
  usablePlaceIdx: number;
  fixedDiscount?: {
    menuName: string;
    price: number;
  };
  percentDiscount?: {
    menuName: string;
    percent: number;
    maxPrice: number | null;
  };
  etc?: {
    name: string;
  };
}
