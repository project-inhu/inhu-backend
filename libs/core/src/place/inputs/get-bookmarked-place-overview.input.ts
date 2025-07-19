import { GetPlaceOverviewInput } from '@libs/core/place/inputs/get-place-overview.input';
import { PickType } from '@nestjs/swagger';

export class GetBookmarkedPlaceOverviewInput extends PickType(
  GetPlaceOverviewInput,
  [
    'take',
    'skip',
    'activated',
    'operating',
    'coordinate',
    'types',
    'permanentlyClosed',
  ],
) {
  /**
   * 북마크한 사용자의 인덱스
   */
  public userIdx: number;

  /**
   * 정렬 방식
   *
   * @default 'desc'
   */
  public order?: 'desc' | 'asc';
}
