import { GetPlaceOverviewInput } from '@libs/core/place/inputs/get-place-overview.input';
import { PickType } from '@nestjs/swagger';

/**
 * 북마크된 장소 개요 조회 입력 input
 *
 * @publicApi
 */
export class GetPlaceMarkerInput extends PickType(GetPlaceOverviewInput, [
  'orderBy',
  'order',
  'operating',
  'types',
  'activated',
  'permanentlyClosed',
  'searchKeyword',
]) {}
