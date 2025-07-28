import { PickedPlaceOverviewEntity } from '../../entity/picked-place.overview.entity';

export class GetAllPickedPlaceOverviewResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 장소 목록 data
   */
  pickedPlaceOverviewList: PickedPlaceOverviewEntity[];
}
