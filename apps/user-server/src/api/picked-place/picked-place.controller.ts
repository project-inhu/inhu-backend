import { Controller, Get, Query } from '@nestjs/common';
import { PickedPlaceService } from './picked-place.service';
import { User } from '@user/common/decorator/user.decorator';
import { Exception } from '@libs/common';
import { GetAllPickedPlaceOverviewDto } from './dto/request/get-all-picked-place-overview.dto';
import { LoginUser } from '@user/common/types/LoginUser';
import { GetAllPickedPlaceOverviewResponseDto } from './dto/response/get-all-picked-place.response.dto';

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
    @Query() dto: GetAllPickedPlaceOverviewDto,
    @User() loginUser?: LoginUser,
  ): Promise<GetAllPickedPlaceOverviewResponseDto> {
    return await this.pickedPlaceService.getAllPickedPlaceOverview(
      dto,
      loginUser?.idx,
    );
  }
}
