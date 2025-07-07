import { Controller, Get, Query } from '@nestjs/common';
import { PickedPlaceService } from './picked-place.service';
import { GetAllPickedPlaceDto } from './dto/get-all-picked-place.dto';
import { User } from 'src/common/decorator/user.decorator';
import { PickedPlaceEntity } from './entity/picked-place.entity';

@Controller('picked-place')
export class PickedPlaceController {
  constructor(private pickedPlaceService: PickedPlaceService) {}

  /**
   * 선정된 장소 (Picked Place) 모두 가져오기
   *
   * @author 강정연
   */
  @Get()
  async getAllPickedPlace(
    @Query() getAllPickedPlaceDto: GetAllPickedPlaceDto,
    @User('idx') userIdx?: number,
  ): Promise<PickedPlaceEntity[]> {
    return await this.pickedPlaceService.getAllPickedPlace(
      getAllPickedPlaceDto.page,
      userIdx,
    );
  }
}
