import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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
import { MagazineLikeEntity } from './entity/magazine-like.entity';

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

  @Post('/:idx/like')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found for idx: {idx}')
  @Exception(409, 'Magazine like already exists')
  @HttpCode(200)
  @LoginAuth()
  public async likeMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser: LoginUser,
  ): Promise<MagazineLikeEntity> {
    return await this.magazineService.likeMagazineByIdx(loginUser, idx);
  }

  @Delete('/:idx/like')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found for idx: {idx}')
  @Exception(409, 'Magazine like does not exist')
  @HttpCode(200)
  @LoginAuth()
  public async unlikeMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser: LoginUser,
  ): Promise<void> {
    return await this.magazineService.unlikeMagazineByIdx(loginUser, idx);
  }
}
