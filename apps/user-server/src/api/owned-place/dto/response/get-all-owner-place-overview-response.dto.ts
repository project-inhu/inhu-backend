import { OwnedPlaceOverviewEntity } from '../../entity/owned-place-overview.entity';

export class GetAllOwnerPlaceOverviewResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  hasNext: boolean;

  /**
   * 장소 목록 data
   */
  ownedPlaceOverviewList: OwnedPlaceOverviewEntity[];
}
