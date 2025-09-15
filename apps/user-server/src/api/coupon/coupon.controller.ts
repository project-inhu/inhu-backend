import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/request/create-coupon.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetCouponAllByPlaceIdxDto } from './dto/request/get-coupon-all-by-place-idx.dto';
import { GetCouponAllByPlaceIdxResponseDto } from './dto/response/get-coupon-all-by-place-idx-response.dto';

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
    @Query() dto: GetCouponAllByPlaceIdxDto,
  ): Promise<GetCouponAllByPlaceIdxResponseDto> {
    return this.couponService.getCouponAllByPlaceIdx(placeIdx, dto);
  }

  /**
   * 특정 장소에 쿠폰 생성
   *
   * - fixedDiscount, percentDiscount, variant 중 한 개의 타입만 포함해야 함
   */
  @Post('place/:placeIdx/coupon')
  public async createCoupon(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() dto: CreateCouponDto,
  ): Promise<void> {
    return await this.couponService.createCoupon(dto, placeIdx);
  }
}
