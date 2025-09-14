import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CouponTemplateService } from './coupon-template.service';
import { CreateCouponTemplateDto } from './dto/request/create-coupon-template.dto';
import { UpdateCouponTemplateDto } from './dto/request/update-coupon-template.dto';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';

@Controller()
export class CouponTemplateController {
  constructor(private readonly couponTemplateService: CouponTemplateService) {}

  @Get('place/:placeIdx/coupon-template/all')
  @LoginAuth()
  public async getCouponTemplateAllByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
  ) {
    return await this.couponTemplateService.getCouponTemplateAllByPlaceIdx(
      placeIdx,
    );
  }

  @Post('place/:placeIdx/coupon-template')
  @LoginAuth()
  public async createCouponTemplate(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() dto: CreateCouponTemplateDto,
  ) {
    return await this.couponTemplateService.createCouponTemplate(dto, placeIdx);
  }

  @Put('place/:placeIdx/coupon-template/:id')
  @LoginAuth()
  public async updateCouponTemplateById(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCouponTemplateDto,
  ): Promise<void> {
    return await this.couponTemplateService.updateCouponTemplateById(id, dto);
  }
}
