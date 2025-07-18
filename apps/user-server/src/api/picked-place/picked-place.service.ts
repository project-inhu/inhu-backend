import { Injectable } from '@nestjs/common';
import { PickedPlaceRepository } from './picked-place.repository';
import { PickedPlaceOverviewEntity } from './entity/picked-place-overview.entity';
import { GetAllPickedPlaceOverviewResponseDto } from './dto/get-all-picked-place-overview-response.dto';

@Injectable()
export class PickedPlaceService {
  constructor(private readonly pickedPlaceRepository: PickedPlaceRepository) {}

  /**
   * 선정된 장소 개요 (Picked Place) 모두 가져오기
   *
   * @author 강정연
   */
  async getAllPickedPlaceOverview(
    page: number,
    userIdx?: number,
  ): Promise<GetAllPickedPlaceOverviewResponseDto> {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (page - 1) * pageSize;

    let placeList =
      await this.pickedPlaceRepository.selectAllPickedPlaceOverview(
        skip,
        take,
        userIdx,
      );

    const hasNext = !!placeList[pageSize];
    placeList = placeList.slice(0, pageSize);

    return {
      hasNext,
      data: placeList.map(PickedPlaceOverviewEntity.createEntityFromPrisma),
    };
  }
}
