import { PlaceOverviewEntity } from '../../entity/place-overview.entity';

export class GetAllBookmarkedOverviewResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 장소 목록 data
   */
  placeOverviewList: PlaceOverviewEntity[];
}
