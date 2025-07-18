import { PlaceType } from '@user/api/place/constants/place-type.constant';

/**
 * @deprecated
 */
export class SelectPlaceOverviewInput {
  /**
   * place 개요를 가져오는 사용자의 idx
   */
  readUserIdx?: number;

  /**
   * 몇 개 가져올지
   */
  take: number;

  /**
   * 몇 개 스킵할지
   */
  skip: number;

  /**
   * 정렬 옵션
   *
   * time =
   */
  orderBy?: 'time' | 'review';

  order?: 'desc' | 'asc';

  /**
   * 운영중 여부 필터링
   *
   * true: 운영 중인 장소만
   * false: 운영 중이지 않은 장소만
   * undefined: 운영 중인 장소와 운영 중이지 않은 장소 모두 가져오기
   */
  operating?: boolean;

  /**
   * 특정 사용자가 북마크한 장소만 필터링
   */
  bookmarkUserIdx?: number;

  /**
   * 좌표 필터링
   */
  coordinate?: {
    leftTopX: number;
    leftTopY: number;
    rightBottomX: number;
    rightBottomY: number;
  };

  /**
   * type 필터링
   */
  types?: PlaceType[];
}
