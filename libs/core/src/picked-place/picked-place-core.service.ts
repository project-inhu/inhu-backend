import { CreatePickedPlaceInput } from './inputs/create-picked-place.input';
import { GetPickedPlaceAllInput } from './inputs/get-picked-place-all.input';
import { UpdatePickedPlaceInput } from './inputs/update-picked-place.input';
import { PickedPlaceOverviewModel } from './model/picked-place-overview.model';
import { PickedPlaceModel } from './model/picked-place.model';
import { PickedPlaceCoreRepository } from './picked-place-core.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PickedPlaceCoreService {
  constructor(
    private readonly pickedPlaceCoreRepository: PickedPlaceCoreRepository,
  ) {}

  public async getPickedPlaceByIdx(
    idx: number,
  ): Promise<PickedPlaceModel | null> {
    const pickedPlace =
      await this.pickedPlaceCoreRepository.selectPickedPlaceByIdx(idx);
    return pickedPlace && PickedPlaceModel.fromModel(pickedPlace);
  }

  public async getPickedPlaceAll(
    input: GetPickedPlaceAllInput,
  ): Promise<PickedPlaceOverviewModel[]> {
    return await this.pickedPlaceCoreRepository
      .selectPickedPlaceAll(input)
      .then((result) => result.map(PickedPlaceOverviewModel.fromModel));
  }

  public async createPickedPlace(
    placeIdx: number,
    input: CreatePickedPlaceInput,
  ): Promise<PickedPlaceModel> {
    return await this.pickedPlaceCoreRepository
      .insertPickedPlace(placeIdx, input)
      .then(PickedPlaceModel.fromModel);
  }

  /**
   * @param idx pickedIdx - placeIdx가 아닙니다.
   */
  public async updatePickedPlaceByIdx(
    idx: number,
    input: UpdatePickedPlaceInput,
  ): Promise<void> {
    return await this.pickedPlaceCoreRepository.updatePickedPlaceByIdx(
      idx,
      input,
    );
  }

  public async deletedPickedPlaceByIdx(idx: number): Promise<void> {
    return await this.pickedPlaceCoreRepository.softDeletePickedPlaceByIdx(idx);
  }
}
