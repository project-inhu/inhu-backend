import {
  Controller,
  Get,
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
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine-response.dto';

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

  @Get('/all')
  public async getMagazineAll(
    @Query() dto: GetAllMagazineDto,
  ): Promise<GetAllMagazineResponseDto> {
    return await this.magazineService.getMagazineAll(dto);
  }

  @Post('/:idx/like')
  @LoginAuth()
  public async likeMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.magazineService.likeMagazineByIdx(idx);
  }

  @Post('/:idx/unlike')
  @LoginAuth()
  public async unlikeMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.magazineService.unlikeMagazineByIdx(idx);
  }
}
