import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CouponTemplateService } from './coupon-template.service';
import { CreateCouponTemplateDto } from './dto/request/create-coupon-template.dto';
import { UpdateCouponTemplateDto } from './dto/request/update-coupon-template.dto';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { GetCouponTemplateAllByPlaceIdxDto } from './dto/request/get-coupon-template-all-by-place-idx.dto';
import { GetCouponTemplateAllByPlaceIdxResponseDto } from './dto/response/get-coupon-template-all-by-place-idx-response.dto';
import { CouponTemplateEntity } from './entity/coupon-template.entity';

@Controller()
export class CouponTemplateController {
  constructor(private readonly couponTemplateService: CouponTemplateService) {}

  /**
   * 특정 장소의 모든 쿠폰 템플릿 조회
   */
  @Get('place/:placeIdx/coupon-template/all')
  @LoginAuth()
  public async getCouponTemplateAllByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Query() dto: GetCouponTemplateAllByPlaceIdxDto,
  ): Promise<GetCouponTemplateAllByPlaceIdxResponseDto> {
    return await this.couponTemplateService.getCouponTemplateAllByPlaceIdx(
      dto,
      placeIdx,
    );
  }

  /**
   * 특정 장소에 쿠폰 템플릿 생성
   * - fixedDiscount, percentDiscount, variant 중 한 개의 타입만 포함해야 함
   */
  // TODO: 사장님만 가능해야 함.
  @Post('place/:placeIdx/coupon-template')
  @LoginAuth()
  public async createCouponTemplate(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() dto: CreateCouponTemplateDto,
  ): Promise<CouponTemplateEntity> {
    return await this.couponTemplateService.createCouponTemplate(dto, placeIdx);
  }

  /**
   * 특정 쿠폰 템플릿 수정
   *
   * - fixedDiscount, percentDiscount, variant 중 한 개의 타입만 포함해야 함
   */
  // TODO: 사장님만 가능해야 함.
  @Put('coupon-template/:id')
  @LoginAuth()
  public async updateCouponTemplateById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCouponTemplateDto,
  ): Promise<void> {
    return await this.couponTemplateService.updateCouponTemplateById(id, dto);
  }

  /**
   * 쿠폰 템플릿 삭제
   */
  @Delete('coupon-template/:id')
  @LoginAuth()
  public async deleteCouponTemplateById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.couponTemplateService.deleteCouponTemplateById(id);
  }
}
