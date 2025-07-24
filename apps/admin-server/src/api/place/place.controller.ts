import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { PlaceService } from '@admin/api/place/place.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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
}
