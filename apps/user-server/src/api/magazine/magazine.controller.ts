import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MagazineService } from './magazine.service';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { MagazineEntity } from './entity/magazine.entity';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine-response.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { GetAllLikedMagazineDto } from './dto/request/get-all-liked-magazine.dto';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { GetAllLikedMagazineResponseDto } from './dto/response/get-all-liked-magazine-response.dto';

@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Get('/all')
  public async getMagazineAll(
    @Query() dto: GetAllMagazineDto,
    @User() loginUser?: LoginUser,
  ): Promise<GetAllMagazineResponseDto> {
    return await this.magazineService.getMagazineAll(dto, loginUser);
  }

  @Get('/:idx')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found for idx: {idx}')
  public async getMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser?: LoginUser,
  ): Promise<MagazineEntity> {
    return await this.magazineService.getMagazineByIdx(idx, loginUser);
  }

  @Get('/liked/all')
  @Exception(400, 'Invalid querystring')
  @LoginAuth()
  public async getLikedMagazineAll(
    @Query() dto: GetAllLikedMagazineDto,
    @User() loginUser: LoginUser,
  ): Promise<GetAllLikedMagazineResponseDto> {
    return await this.magazineService.getLikedMagazineAllByUserIdx(
      dto,
      loginUser.idx,
    );
  }
}
