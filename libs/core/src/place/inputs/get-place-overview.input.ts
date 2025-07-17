import { PlaceType } from '@user/api/place/constants/place-type.constant';

export class GetPlaceOverviewInput {
  /**
   * 한 번에 가져올 개수
   */
  take: number;

  /**
   * 스킵할 데이터의 개수
   */
  skip: number;

  /**
   * 정렬 옵션
   *
   * time = 시간순
   * review = 리뷰 개수 순
   * bookmark = 북마크 개수 순
   */
  orderBy?: 'time' | 'review' | 'bookmark';

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
