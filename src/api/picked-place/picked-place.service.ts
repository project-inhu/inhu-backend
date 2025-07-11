import { Injectable } from '@nestjs/common';
import { PickedPlaceRepository } from './picked-place.repository';
import { PickedPlaceOverviewEntity } from './entity/picked-place-overview.entity';

@Injectable()
export class PickedPlaceService {
  constructor(private readonly pickedPlaceRepository: PickedPlaceRepository) {}

  /**
   * 선정된 장소 개요 (Picked Place) 모두 가져오기
   *
   * @author 강정연
   */
  async getAllPickedPlaceOverview(
    page: number,
    userIdx?: number,
  ): Promise<PickedPlaceOverviewEntity[]> {
    return (
      await this.pickedPlaceRepository.selectAllPickedPlaceOverview(
        page,
        userIdx,
      )
    ).map(PickedPlaceOverviewEntity.createEntityFromPrisma);
  }
}
