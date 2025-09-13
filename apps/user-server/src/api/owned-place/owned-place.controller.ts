import { Controller, Get, Query } from '@nestjs/common';
import { OwnedPlaceService } from './owned-place.service';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { GetAllOwnerPlaceOverviewDto } from './dto/response/get-all-owner-place-overview-response.dto';
import { GetAllOwnerPlaceOverviewResponseDto } from './dto/request/get-all-owner-place-overview.dto';

@Controller('owned-place')
export class OwnedPlaceController {
  constructor(private readonly ownedPlaceService: OwnedPlaceService) {}

  /**
   * 내 가게 조회
   *
   * @author 이수인
   */
  @Get('/all')
  @LoginAuth()
  async getAllOwnerPlaceOverview(
    @Query() dto: GetAllOwnerPlaceOverviewDto,
    @User() user: LoginUser,
  ): Promise<GetAllOwnerPlaceOverviewResponseDto> {
    return await this.ownedPlaceService.getOwnerPlaceOverviewAll(dto, user.idx);
  }
}
