import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponEntity } from './entity/coupon.entity';
import { CreateCouponDto } from './dto/request/create-coupon.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  /**
   * 특정 장소의 모든 쿠폰 조회
   */
  @Get('place/:placeIdx/coupon/all')
  public async getCouponAllByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
  ): Promise<CouponEntity[]> {
    return this.couponService.getCouponAllByPlaceIdx(placeIdx);
  }

  /**
   * 특정 장소에 쿠폰 생성
   */
  @Post('place/:placeIdx/coupon')
  public async createCoupon(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() dto: CreateCouponDto,
  ): Promise<CouponEntity[]> {
    return this.couponService.createCoupon(dto, placeIdx);
  }
}
