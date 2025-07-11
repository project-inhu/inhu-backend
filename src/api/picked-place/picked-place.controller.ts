import { Controller, Get, Query } from '@nestjs/common';
import { PickedPlaceService } from './picked-place.service';
import { GetAllPickedPlaceDto } from './dto/get-all-picked-place.dto';
import { User } from 'src/common/decorator/user.decorator';
import { PickedPlaceOverviewEntity } from './entity/picked-place-overview.entity';
import { Exception } from 'src/common/decorator/exception.decorator';

@Controller('picked-place')
export class PickedPlaceController {
  constructor(private pickedPlaceService: PickedPlaceService) {}

  /**
   * 선정된 장소 개요 (Picked Place) 모두 가져오기
   *
   * @author 강정연
   */
  @Exception(400, 'Invalid page number')
  @Get('/all')
  async getAllPickedPlaceOverview(
    @Query() getAllPickedPlaceOverviewDto: GetAllPickedPlaceOverviewDto,
    @User('idx') userIdx?: number,
  ): Promise<PickedPlaceOverviewEntity[]> {
    return await this.pickedPlaceService.getAllPickedPlaceOverview(
      getAllPickedPlaceOverviewDto.page,
      userIdx,
    );
  }
}
