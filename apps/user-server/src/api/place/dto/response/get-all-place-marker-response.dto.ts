import { PlaceMarkerEntity } from '../../entity/place-marker.entity';

export class GetAllPlaceMarkerResponseDto {
  /**
   * 장소 목록 data
   */
  placeMarkerList: PlaceMarkerEntity[];
}
