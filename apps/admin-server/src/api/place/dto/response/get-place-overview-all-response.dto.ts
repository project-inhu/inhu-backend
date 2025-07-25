import { PlaceOverviewEntity } from '@admin/api/place/entity/place-overview.entity';

export class GetPlaceOverviewAllResponseDto {
  public placeList: PlaceOverviewEntity[];
  public count: number;
}
