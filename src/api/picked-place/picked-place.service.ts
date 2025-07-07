import { Injectable } from '@nestjs/common';
import { PickedPlaceRepository } from './picked-place.repository';

@Injectable()
export class PickedPlaceService {
  constructor(private readonly pickedPlaceRepository: PickedPlaceRepository) {}

  async getAllPickedPlace(page: number, userIdx?: number) {
    return await this.pickedPlaceRepository.selectAllPickedPlace(page, userIdx);
  }
}
