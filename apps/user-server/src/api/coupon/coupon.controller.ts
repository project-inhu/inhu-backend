import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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
  // TODO: 옵션에 따라 이미 발급한 쿠폰은 안 보여줘야 됨.
  // TODO: 옵션에 따라 만료 정렬 필요
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
  // TODO: 사장님만 가능해야 함.
  @Post('place/:placeIdx/coupon')
  public async createCoupon(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() dto: CreateCouponDto,
  ): Promise<void> {
    return await this.couponService.createCoupon(dto, placeIdx);
  }

  // TODO: 사장님만 가능해야 함
  // TODO: 활설화 시간이 지났는지 체크 여부 필요
  @Delete('bundle/:bundleId/coupon/all')
  public async deleteCouponAllByBundleId(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
  ): Promise<void> {
    await this.couponService.deleteCouponAllByBundleId(bundleId);
  }
}
