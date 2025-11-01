import { Controller, Get } from '@nestjs/common';
import { PinnedMagazineOverviewEntity } from './entity/pinned-magazine-overview.entity';
import { PinnedMagazineService } from './pinned-magazine.service';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';

@Controller('pinned-magazine')
export class PinnedMagazineController {
  constructor(private readonly pinnedMagazineService: PinnedMagazineService) {}

  @Get('/all')
  public async getPinnedMagazineAll(
    @User() loginUser: LoginUser,
  ): Promise<PinnedMagazineOverviewEntity[]> {
    return await this.pinnedMagazineService.getPinnedMagazineAll(loginUser);
  }
}
