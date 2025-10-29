import {
  Body,
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
import { MagazineEntity } from './entity/magazine.entity';
import { CreateMagazineDto } from './dto/request/create-magazine.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine.response.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  /**
   * 모든 매거진 조회
   *
   * @author 이수인
   */
  @AdminAuth()
  @Get('/all')
  @Exception(400, 'Invalid magazine request')
  public async getMagazineAll(
    @Query() dto: GetAllMagazineDto,
  ): Promise<GetAllMagazineResponseDto> {
    return await this.magazineService.getMagazineAll(dto);
  }

  /**
   * 매거진 자세히보기
   */
  @AdminAuth()
  @Get('/:idx')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find magazine')
  public async getMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<MagazineEntity> {
    return await this.magazineService.getMagazineByIdx(idx);
  }

  /**
   * 매거진 생성
   *
   * @author 이수인
   */
  @AdminAuth()
  @Post()
  @Exception(400, 'Invalid create magazine request')
  @Exception(404, 'Places not found for idx: {idx list}')
  public async createMagazine(
    @Body() dto: CreateMagazineDto,
  ): Promise<MagazineEntity> {
    return await this.magazineService.createMagazine(dto);
  }

  /**
   * 매거진 활성화
   *
   * @author 이수인
   */
  @AdminAuth()
  @Post(':idx/activate')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found')
  @Exception(409, 'Magazine is already activated')
  @HttpCode(200)
  public async activateMagazineActivatedAtByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.magazineService.activateMagazineActivatedAtByIdx(idx);
  }

  /**
   * 매거진 비활성화
   *
   * @author 이수인
   */
  @AdminAuth()
  @Post(':idx/deactivate')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found')
  @Exception(409, 'Magazine is not activated')
  @HttpCode(200)
  public async deactivateMagazineActivatedAtByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.magazineService.deactivateMagazineActivatedAtByIdx(idx);
  }

  /**
   * 매거진 삭제
   *
   * @author 이수인
   */
  @AdminAuth()
  @Delete(':idx')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found')
  public async deleteMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.magazineService.deleteMagazineByIdx(idx);
  }
}
