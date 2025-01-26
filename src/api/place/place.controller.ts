import { Body, Controller, Get } from '@nestjs/common';
import { PlaceService } from './place.service';
import { AllPlaceResponseDto, GetAllPlaceDto } from './place.dto';

@Controller('place')
export class PlaceController {
    constructor(private placeService: PlaceService) { }

    @Get()
    async getAllPlace(
        @Body() getAllPlaceDto: GetAllPlaceDto
    ): Promise<AllPlaceResponseDto> {
        return this.placeService.getAllPlace(getAllPlaceDto);
    }
}
