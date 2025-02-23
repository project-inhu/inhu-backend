import { Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';
import { PlaceOverviewEntity } from './entity/place-overview.entity';

@Injectable()
export class PlaceService {
  constructor(
    private placeRepository: PlaceRepository,
    private keywordRepository: KeywordRepository,
  ) {}

  async getAllPlaceOverview(
    getAllPlaceOverviewDto: GetAllPlaceOverviewDto,
  ): Promise<PlaceOverviewEntity[]> {
    return (
      await this.placeRepository.selectAllPlaceOverview(getAllPlaceOverviewDto)
    ).map(PlaceOverviewEntity.createEntityFromPrisma);
  }
}
