import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MagazineService } from './magazine.service';
import { GetAllMagazineOverviewDto } from './dto/request/get-all-magazine-overview.dto';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { MagazineEntity } from './entity/magazine.entity';
import { MagazineOverviewEntity } from './entity/magazine-overview.entity';

@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Get('/:idx')
  public async getMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser?: LoginUser,
  ): Promise<MagazineEntity | null> {
    return await this.magazineService.getMagazineByIdx(idx, loginUser);
  }

  @Get('/overview/all')
  public async getMagazineOverviewAll(
    @Query() dto: GetAllMagazineOverviewDto,
  ): Promise<MagazineOverviewEntity[]> {
    return await this.magazineService.getMagazineOverviewAll(dto);
  }
}
