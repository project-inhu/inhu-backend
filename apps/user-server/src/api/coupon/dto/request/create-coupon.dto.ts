export class CreateCouponDto {
  description: string | null;
  imagePath: string | null;
  expiredAt: Date;
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
  count: number;
}
