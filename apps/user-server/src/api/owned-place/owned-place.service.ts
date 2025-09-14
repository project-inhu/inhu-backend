import { OwnedPlaceCoreService } from '@libs/core/owned-place/owned-place-core.service';
import { Injectable } from '@nestjs/common';
import { OwnedPlaceOverviewEntity } from './entity/owned-place-overview.entity';
import { GetAllOwnerPlaceOverviewDto } from './dto/request/get-all-owner-place-overview.dto';

@Injectable()
export class OwnedPlaceService {
  constructor(private readonly ownedPlaceCoreService: OwnedPlaceCoreService) {}

  public async getOwnerPlaceOverviewAll(
    dto: GetAllOwnerPlaceOverviewDto,
    userIdx: number,
  ): Promise<{
    hasNext: boolean;
    ownedPlaceOverviewList: OwnedPlaceOverviewEntity[];
  }> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;

    const ownedPlaceOverviewModelList =
      await this.ownedPlaceCoreService.getOwnerPlaceOverviewAllByUserIdx(
        {
          take: pageSize + 1,
          skip: skip,
        },
        userIdx,
      );

    const paginatedList = ownedPlaceOverviewModelList.slice(0, pageSize);
    const hasNext = ownedPlaceOverviewModelList.length > pageSize;

    return {
      hasNext,
      ownedPlaceOverviewList: paginatedList.map((place) =>
        OwnedPlaceOverviewEntity.fromModel(place),
      ),
    };
  }
}
