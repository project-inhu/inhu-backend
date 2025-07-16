import { Query, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlaceService } from './place.service';
import { User } from 'src/common/decorator/user.decorator';
import { PlaceEntity } from './entity/place.entity';
import { Exception } from 'src/common/decorator/exception.decorator';
import { GetAllPlaceOverviewResponseDto } from './dto/get-all-place-overview-response.dto';
import { GetAllPlaceOverviewByNowDto } from './dto/get-all-place-overview-by-now.dto';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { GetAllPlaceOverviewDto } from 'src/api/place/dto/request/get-all-place-overview.dto';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  /**
   * 모든 place 개요 가져오기
   *
   * @author 강정연
   */
  @Exception(400, 'Invalid page number or orderBy')
  @Get('/all')
  async getAllPlaceOverview(
    @Query() dto: GetAllPlaceOverviewDto,
    @User('idx') userIdx?: number,
  ): Promise<GetAllPlaceOverviewResponseDto> {
    return await this.placeService.getAllPlaceOverview(dto, userIdx);
  }

  /**
   * 특정 idx의 place 관련 모든 정보 가져오기
   *
   * @author 강정연
   */
  @Exception(400, 'Invalid placeIdx')
  @Exception(404, 'Place not found')
  @Get('/:placeIdx')
  async getPlaceByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @User('idx') userIdx?: number,
  ): Promise<PlaceEntity> {
    return await this.placeService.getPlaceByPlaceIdx(placeIdx, userIdx);
  }

  // @Get('/now')
  // async getAllPlaceOverviewByNow(
  //   @Query() getAllPlaceOverviewByNowDto: GetAllPlaceOverviewByNowDto,
  //   @User('idx') userIdx?: number,
  // ) {
  //   return await this.placeService.getAllPlaceOverviewByNow(
  //     getAllPlaceOverviewByNowDto.page,
  //     userIdx,
  //   );
  // }
}
