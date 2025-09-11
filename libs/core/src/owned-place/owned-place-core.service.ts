import { Injectable } from '@nestjs/common';
import { OwnedPlaceCoreRepository } from './owned-place-core.repository';
import { OwnedPlaceModel } from './model/owned-place.model';

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

  public async getOwnerPlaceAllByUserIdx(
    userIdx: number,
  ): Promise<OwnedPlaceModel[]> {
    return (
      await this.ownedPlaceCoreRepository.selectOwnerPlaceAllByUserIdx(userIdx)
    ).map(OwnedPlaceModel.fromPrisma);
  }
}
