import { Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';

@Injectable()
export class PlaceService {
    constructor(private placeRepository: PlaceRepository) { }
}
