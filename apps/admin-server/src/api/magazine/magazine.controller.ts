import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MagazineService } from './magazine.service';
import { MagazineEntity } from './entity/magazine.entity';
import { CreateMagazineDto } from './dto/request/create-magazine.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine.response.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @AdminAuth()
  @Get('/all')
  @Exception(400, 'Invalid magazine request')
  public async getMagazineAll(
    @Query() dto: GetAllMagazineDto,
  ): Promise<GetAllMagazineResponseDto> {
    return await this.magazineService.getMagazineAll(dto);
  }

  @AdminAuth()
  @Post()
  @Exception(400, 'Invalid create magazine request')
  @Exception(404, 'Places not found for idx: {idx list}')
  public async createMagazine(
    @Body() dto: CreateMagazineDto,
  ): Promise<MagazineEntity> {
    return await this.magazineService.createMagazine(dto);
  }
}
