import { Query, Controller, Get } from '@nestjs/common';
import { PlaceService } from './place.service';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';
import { AllPlaceOverviewResponseDto } from './dto/all-place-overview-response.dto';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get('/all')
  async getAllPlaceOverview(
    @Query() getAllPlaceOverviewDto: GetAllPlaceOverviewDto,
  ): Promise<AllPlaceOverviewResponseDto> {
    const placeOverviewList = await this.placeService.getAllPlaceOverview(
      getAllPlaceOverviewDto,
    );

    return { placeOverviewList };
  }
}
