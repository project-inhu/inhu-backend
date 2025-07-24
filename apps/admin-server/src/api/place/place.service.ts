import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { PlaceNotFoundException } from '@admin/api/place/exception/place-not-found.exception';
import { PlaceCoreService } from '@libs/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlaceService {
  constructor(private readonly placeCoreService: PlaceCoreService) {}

  public async getPlaceByIdx(idx: number): Promise<PlaceEntity> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    return PlaceEntity.fromModel(place);
  }
}
