export class CreateCouponTemplateDto {
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
