import { Body, Controller, Get, Post } from '@nestjs/common';
import { MagazineService } from './magazine.service';
import { MagazineEntity } from './entity/magazine.entity';
import { CreateMagazineDto } from './dto/create-magazine.dto';

@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Post()
  public async createMagazine(
    @Body() dto: CreateMagazineDto,
  ): Promise<MagazineEntity> {
    return await this.magazineService.createMagazine(dto);
  }
}
