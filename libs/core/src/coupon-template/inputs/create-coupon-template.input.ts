/**
 * 쿠폰 템플릿 생성 Input
 *
 * @publicApi
 */
export class CreateCouponTemplateInput {
  placeIdx: number;
  description: string | null;
  imagePath: string | null;
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
