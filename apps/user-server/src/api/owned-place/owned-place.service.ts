import { OwnedPlaceCoreService } from '@libs/core/owned-place/owned-place-core.service';
import { Injectable } from '@nestjs/common';
import { OwnedPlaceEntity } from './entity/owned-place.entity';

@Injectable()
export class OwnedPlaceService {
  constructor(private readonly ownedPlaceCoreService: OwnedPlaceCoreService) {}

  public async getOwnerPlaceAll(userIdx: number): Promise<OwnedPlaceEntity[]> {
    return (
      await this.ownedPlaceCoreService.getOwnerPlaceAllByUserIdx(userIdx)
    ).map((place) => OwnedPlaceEntity.fromModel(place));
  }
}
