import { Injectable } from '@nestjs/common';
import { PickedPlaceRepository } from './picked-place.repository';
import { PickedPlaceEntity } from './entity/picked-place.entity';

@Injectable()
export class PickedPlaceService {
  constructor(private readonly pickedPlaceRepository: PickedPlaceRepository) {}

  async getAllPickedPlace(
    page: number,
    userIdx?: number,
  ): Promise<PickedPlaceEntity[]> {
    return (
      await this.pickedPlaceRepository.selectAllPickedPlace(page, userIdx)
    ).map(PickedPlaceEntity.createEntityFromPrisma);
  }
}
