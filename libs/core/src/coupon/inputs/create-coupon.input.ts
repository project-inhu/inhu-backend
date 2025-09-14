/**
 * 쿠폰 생성 input
 *
 * @publicApi
 */
export class CreateCouponInput {
  bundleId: string;
  description: string | null;
  imagePath: string | null;
  activatedAt: Date;
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
  variant?: {
    name: string;
  };
}
