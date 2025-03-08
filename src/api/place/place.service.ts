import { Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';
import { PlaceOverviewEntity } from './entity/place-overview.entity';
import { GetPlaceByPlaceIdxDto } from './dto/get-place-detail.dto';
import { PlaceEntity } from './entity/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { Place } from '@prisma/client';
import { UploadPlaceImageByPlaceIdxDto } from './dto/upload-place-image-by-place-idx.dto';

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

  async getPlaceByIdx(
    getPlaceByPlaceIdxDto: GetPlaceByPlaceIdxDto,
  ): Promise<PlaceEntity | null> {
    const place = await this.placeRepository.selectPlaceByIdx(
      getPlaceByPlaceIdxDto.idx,
    );

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
    uploadPlaceImageByPlaceIdxDto: UploadPlaceImageByPlaceIdxDto,
    placeIdx: number,
  ): Promise<void> {
    return this.placeRepository.uploadPlaceImageByPlaceIdx(
      uploadPlaceImageByPlaceIdxDto.placeImageList,
      placeIdx,
    );
  }
}
