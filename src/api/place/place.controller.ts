import { Query, Controller, Get, Param } from '@nestjs/common';
import { PlaceService } from './place.service';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';
import { AllPlaceOverviewResponseDto } from './dto/all-place-overview-response.dto';
import { GetPlaceByPlaceIdxDto } from './dto/get-place-detail.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { PlaceByPlaceIdxResponseDto } from './dto/place-by-place-idx-response.dto';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @ApiOkResponse({ type: AllPlaceOverviewResponseDto })
  @Get('/all')
  async getAllPlaceOverview(
    @Query() getAllPlaceOverviewDto: GetAllPlaceOverviewDto,
  ): Promise<AllPlaceOverviewResponseDto> {
    const placeOverviewList = await this.placeService.getAllPlaceOverview(
      getAllPlaceOverviewDto,
    );

    return { placeOverviewList };
  }

  @ApiOkResponse({ type: PlaceByPlaceIdxResponseDto })
  @Get('/:idx')
  async getPlaceByIdx(
    @Param() getPlaceByPlaceIdxDto: GetPlaceByPlaceIdxDto,
  ): Promise<PlaceByPlaceIdxResponseDto> {
    const place = await this.placeService.getPlaceByIdx(getPlaceByPlaceIdxDto);

    return { place };
  }
}
