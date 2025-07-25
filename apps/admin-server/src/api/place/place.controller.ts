import { CreatePlaceDto } from '@admin/api/place/dto/request/create-place.dto';
import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { PlaceService } from '@admin/api/place/place.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
  @AdminAuth()
  public async createPlace(@Body() dto: CreatePlaceDto): Promise<PlaceEntity> {
    return await this.placeService.createPlace(dto);
  }
}
