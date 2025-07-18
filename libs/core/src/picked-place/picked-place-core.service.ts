import { CreatePickedPlaceInput } from '@app/core/picked-place/inputs/create-picked-place.input';
import { GetPickedPlaceAllInput } from '@app/core/picked-place/inputs/get-picked-place-all.input';
import { PickedPlaceOverviewModel } from '@app/core/picked-place/model/picked-place-overview.model';
import { PickedPlaceModel } from '@app/core/picked-place/model/picked-place.model';
import { PickedPlaceCoreRepository } from '@app/core/picked-place/picked-place-core.repository';
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
}
