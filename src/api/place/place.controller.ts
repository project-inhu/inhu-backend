import {
  Query,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';
import { User } from 'src/common/decorator/user.decorator';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { PlaceEntity } from './entity/place.entity';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  /**
   * 모든 place 개요 가져오기
   *
   * @author 이수인
   */
  @UseGuards(AuthGuard)
  @Get('/all')
  async getAllPlaceOverview(
    @Query() getAllPlaceOverviewDto: GetAllPlaceOverviewDto,
    @User('idx') userIdx: number,
  ): Promise<PlaceOverviewEntity[]> {
    return await this.placeService.getAllPlaceOverview(
      getAllPlaceOverviewDto.page,
      userIdx,
    );
  }

  /**
   * place 관련 모든 정보 가져오기
   *
   * @author 이수인
   */
  @UseGuards(AuthGuard)
  @Get('/:placeIdx')
  async getPlaceByIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @User('idx') userIdx: number,
  ): Promise<PlaceEntity> {
    return await this.placeService.getPlaceByIdx(placeIdx, userIdx);
  }
}
