import { PlaceOverviewEntity } from '../entity/place-overview.entity';

/**
 * GetAllPlaceOverview의 응답 DTO
 *
 * @author 강정연
 */
export class GetAllPlaceOverviewResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 장소 목록 data
   */
  data: PlaceOverviewEntity[];
}
