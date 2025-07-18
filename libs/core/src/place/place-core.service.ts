import { PlaceOverviewModel } from '@app/core/place/model/place-overview.model';
import { PlaceCoreRepository } from '@app/core/place/place-core.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlaceCoreService {
  constructor(private readonly placeCoreRepository: PlaceCoreRepository) {}

  public async getPlaceByIdx(idx: number): Promise<PlaceOverviewModel | null> {
    const place = await this.placeCoreRepository.selectPlaceByIdx(idx);
    return place && PlaceOverviewModel.fromPrisma(place);
  }
}
