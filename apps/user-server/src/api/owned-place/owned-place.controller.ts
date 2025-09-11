import { Controller, Get } from '@nestjs/common';
import { OwnedPlaceService } from './owned-place.service';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { OwnedPlaceEntity } from './entity/owned-place.entity';

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
  async getAllOwnerPlace(@User() user: LoginUser): Promise<OwnedPlaceEntity[]> {
    return await this.ownedPlaceService.getOwnerPlaceAll(user.idx);
  }
}
