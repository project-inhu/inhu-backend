import { PlaceOverviewEntity } from '../../entity/place-overview.entity';

export class GetAllPlaceOverviewMarkerResponseDto {
  /**
   * 장소 목록 data
   */
  placeOverviewList: PlaceOverviewEntity[];
}
