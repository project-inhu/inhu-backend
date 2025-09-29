import { IsUUID } from 'class-validator';

export class CreateCouponOwnerDto {
  /**
   * 쿠폰 ID
   *
   * @example "3fa85f64-5717-4562-b3fc-2c963f66afa6"
   */
  @IsUUID()
  couponId: string;
}
