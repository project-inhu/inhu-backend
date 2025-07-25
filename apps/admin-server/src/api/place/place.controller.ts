import { CreatePlaceDto } from '@admin/api/place/dto/request/create-place.dto';
import { UpdatePlaceDto } from '@admin/api/place/dto/request/update-place.dto';
import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { PlaceService } from '@admin/api/place/place.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('place')
@ApiTags('Place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  /**
   * 장소 자세히보기 Endpoint
   */
  @Get('/:idx')
  @Exception(400, 'Invalid place idx')
  @AdminAuth()
  public async getPlaceByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<PlaceEntity> {
    return await this.placeService.getPlaceByIdx(idx);
  }

  /**
   * 장소 생성하기 Endpoint
   */
  @Post()
  @Exception(400, 'Invalid place data')
  @HttpCode(200)
  @AdminAuth()
  public async createPlace(@Body() dto: CreatePlaceDto): Promise<PlaceEntity> {
    return await this.placeService.createPlace(dto);
  }

  /**
   * 장소 수정하기 Endpoint
   */
  @Put('/:idx')
  @Exception(400, 'Invalid place idx or data')
  @Exception(404, 'Place not found')
  @HttpCode(200)
  @AdminAuth()
  public async updatePlace(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdatePlaceDto,
  ): Promise<void> {
    await this.placeService.updatePlaceByIdx(idx, dto);
  }

  /**
   * 장소 삭제하기 Endpoint
   */
  @Delete('/:idx')
  @Exception(400, 'Invalid place idx')
  @Exception(404, 'Place not found or already deleted')
  @HttpCode(200)
  @AdminAuth()
  public async deletedPlaceByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.placeService.deletePlaceByIdx(idx);
  }

  /**
   * 장소 활성화하기 Endpoint
   */
  @Post('/:idx/activate')
  @Exception(400, 'Invalid place idx')
  @Exception(404, 'Place not found')
  @Exception(409, 'Place is already activated')
  @HttpCode(200)
  @AdminAuth()
  public async activatePlaceByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.placeService.activatePlaceByIdx(idx);
  }
}
