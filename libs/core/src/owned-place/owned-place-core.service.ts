import { Injectable } from '@nestjs/common';
import { OwnedPlaceCoreRepository } from './owned-place-core.repository';
import { OwnedPlaceOverviewModel } from './model/owned-place-overview.model';
import { GetOwnerPlaceOverviewInput } from './inputs/get-owner-place-overview.input';

/**
 * 소유지 코어 서비스
 *
 * @publicApi
 */
@Injectable()
export class OwnedPlaceCoreService {
  constructor(
    private readonly ownedPlaceCoreRepository: OwnedPlaceCoreRepository,
  ) {}

  public async getOwnerPlaceOverviewAllByUserIdx(
    input: GetOwnerPlaceOverviewInput,
    userIdx: number,
  ): Promise<OwnedPlaceOverviewModel[]> {
    return (
      await this.ownedPlaceCoreRepository.selectOwnerPlaceOverviewAllByUserIdx(
        input,
        userIdx,
      )
    ).map(OwnedPlaceOverviewModel.fromPrisma);
  }
}
