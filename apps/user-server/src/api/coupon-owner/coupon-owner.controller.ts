import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CouponOwnerService } from './coupon-owner.service';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { GetOwnedCouponAllByUserIdxDto } from './dto/request/get-owned-coupon-all-by-user-idx.dto';
import { GetOwnedCouponAllByUserIdxResponseDto } from './dto/response/get-owned-coupon-all-by-user-idx-response.dto';
import { CouponOwnerEntity } from './entity/coupon-owner.entity';
import { CreateCouponOwnerDto } from './dto/request/create-coupon-owner.dto';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';

@Controller()
export class CouponOwnerController {
  constructor(private readonly couponOwnerService: CouponOwnerService) {}

  @Get('/user/:userIdx/owned-coupon/all')
  @LoginAuth()
  public async getOwnedCouponAllByUserIdx(
    @Query() dto: GetOwnedCouponAllByUserIdxDto,
    @Param('userIdx') userIdx: number,
  ): Promise<GetOwnedCouponAllByUserIdxResponseDto> {
    return await this.couponOwnerService.getOwnedCouponAllByUserIdx(
      userIdx,
      dto,
    );
  }

  @Post('coupon-owner')
  @LoginAuth()
  async createCouponOwner(
    @Body() dto: CreateCouponOwnerDto,
    @User() loginUser: LoginUser,
  ): Promise<CouponOwnerEntity> {
    return this.couponOwnerService.createCouponOwner(dto, loginUser.idx);
  }
}
