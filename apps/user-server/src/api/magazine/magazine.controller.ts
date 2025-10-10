import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MagazineService } from './magazine.service';
import { GetAllMagazineOverviewDto } from './dto/request/get-all-magazine-overview.dto';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';

@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Get('/:idx')
  @LoginAuth()
  public async getMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser?: LoginUser,
  ) {
    return await this.magazineService.getMagazineByIdx(idx, loginUser);
  }

  @Get('/overview/all')
  public async getMagazineOverviewAll(@Query() dto: GetAllMagazineOverviewDto) {
    return await this.magazineService.getMagazineOverviewAll(dto);
  }
}
