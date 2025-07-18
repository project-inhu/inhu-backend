import { UpdatePlaceInput } from '@app/core/place/inputs/update-place.input';
import { CreatePlaceInput } from './inputs/create-place.input';
import { GetPlaceOverviewInput } from './inputs/get-place-overview.input';
import { PlaceOverviewModel } from './model/place-overview.model';
import { PlaceModel } from './model/place.model';
import { PlaceCoreRepository } from './place-core.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlaceCoreService {
  constructor(private readonly placeCoreRepository: PlaceCoreRepository) {}

  public async getPlaceByIdx(idx: number): Promise<PlaceModel | null> {
    const place = await this.placeCoreRepository.selectPlaceByIdx(idx);
    return place && PlaceModel.fromPrisma(place);
  }

  public async getPlaceAll(
    input: GetPlaceOverviewInput,
  ): Promise<PlaceOverviewModel[]> {
    return (await this.placeCoreRepository.selectPlaceAll(input)).map(
      PlaceOverviewModel.fromPrisma,
    );
  }

  public async createPlace(input: CreatePlaceInput): Promise<PlaceModel> {
    return PlaceModel.fromPrisma(
      await this.placeCoreRepository.insertPlace(input),
    );
  }

  public async updatePlaceByIdx(
    idx: number,
    input: UpdatePlaceInput,
  ): Promise<void> {
    return await this.placeCoreRepository.updatePlaceByIdx(idx, input);
  }
}
