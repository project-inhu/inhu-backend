import { Injectable } from '@nestjs/common';
import { PickedPlaceRepository } from './picked-place.repository';
import { PickedPlaceOverviewEntity } from './entity/picked-place-overview.entity';

@Injectable()
export class PickedPlaceService {
  constructor(private readonly pickedPlaceRepository: PickedPlaceRepository) {}

  async getAllPickedPlace(
    page: number,
    userIdx?: number,
  ): Promise<PickedPlaceOverviewEntity[]> {
    return (
      await this.pickedPlaceRepository.selectAllPickedPlace(page, userIdx)
    ).map(PickedPlaceOverviewEntity.createEntityFromPrisma);
  }
}
