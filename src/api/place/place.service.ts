import { Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { AllPlaceResponseDto, GetAllPlaceDto, Place } from './place.dto';

@Injectable()
export class PlaceService {
    constructor(private placeRepository: PlaceRepository) { }

    async getAllPlace(getAllPlaceDto: GetAllPlaceDto): Promise<AllPlaceResponseDto> {
        return this.placeRepository.getAllPlace(getAllPlaceDto);
    }
}
