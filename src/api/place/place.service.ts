import { Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { PlaceEntity } from './entity/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { Place } from '@prisma/client';

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

  async getPlaceByIdx(placeIdx: number): Promise<PlaceEntity | null> {
    const place = await this.placeRepository.selectPlaceByIdx(placeIdx);

    if (place) {
      return PlaceEntity.createEntityFromPrisma(place);
    } else {
      return null;
    }
  }

  async createPlace(createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placeRepository.createPlace(createPlaceDto);
  }

  async uploadPlaceImageByPlaceIdx(
    placeImageList: string[],
    placeIdx: number,
  ): Promise<void> {
    return this.placeRepository.uploadPlaceImageByPlaceIdx(
      placeImageList,
      placeIdx,
    );
  }
}
