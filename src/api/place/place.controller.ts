import { Query, Controller, Get, Param } from '@nestjs/common';
import { PlaceService } from './place.service';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';
import { AllPlaceOverviewResponseDto } from './dto/all-place-overview-response.dto';
import { GetPlaceByPlaceIdxDto } from './dto/get-place-detail.dto';
import { ApiResponse } from '@nestjs/swagger';
import { PlaceByPlaceIdxResponseDto } from './dto/place-by-place-idx-response.dto';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @ApiResponse({
    status: 200,
    description: '성공',
    type: AllPlaceOverviewResponseDto,
  })
  @Get('/all')
  async getAllPlaceOverview(
    @Query() getAllPlaceOverviewDto: GetAllPlaceOverviewDto,
  ): Promise<AllPlaceOverviewResponseDto> {
    const placeOverviewList = await this.placeService.getAllPlaceOverview(
      getAllPlaceOverviewDto,
    );

    return { placeOverviewList };
  }

  @ApiResponse({
    status: 200,
    description: '성공',
    type: PlaceByPlaceIdxResponseDto,
  })
  @Get('/:idx')
  async getPlaceByPlaceIdx(
    @Param() getPlaceByPlaceIdxDto: GetPlaceByPlaceIdxDto,
  ): Promise<PlaceByPlaceIdxResponseDto> {
    const place = await this.placeService.getPlaceByPlaceIdx(
      getPlaceByPlaceIdxDto,
    );
    console.log(place);
    return { place };
  }
}
