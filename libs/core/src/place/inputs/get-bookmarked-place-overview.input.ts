import { GetPlaceOverviewInput } from '@libs/core/place/inputs/get-place-overview.input';
import { PickType } from '@nestjs/swagger';

/**
 * 북마크된 장소 개요 조회 입력 input
 *
 * @publicApi
 */
export class GetBookmarkedPlaceOverviewInput extends PickType(
  GetPlaceOverviewInput,
  ['take', 'skip', 'activated', 'operating', 'types', 'permanentlyClosed'],
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

  /**
   * 좌표 필터링
   */
  coordinate?: {
    leftTopX: number;
    leftTopY: number;
    rightBottomX: number;
    rightBottomY: number;
  };
}
