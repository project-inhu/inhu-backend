import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { PlaceEntity } from './entity/place.entity';

@Injectable()
export class PlaceService {
  constructor(
    private placeRepository: PlaceRepository,
    private keywordRepository: KeywordRepository,
  ) {}

  async getAllPlaceOverview(
    page: number,
    userIdx: number,
  ): Promise<PlaceOverviewEntity[]> {
    return (
      await this.placeRepository.selectAllPlaceOverview(page, userIdx)
    ).map(PlaceOverviewEntity.createEntityFromPrisma);
  }

  async getPlaceByIdx(
    placeIdx: number,
    userIdx?: number,
  ): Promise<PlaceEntity> {
    const place = await this.placeRepository.selectPlaceByIdx(
      placeIdx,
      userIdx,
    );

    if (!place) {
      throw new NotFoundException('place not found');
    }

    return PlaceEntity.createEntityFromPrisma(place);
  }
}
