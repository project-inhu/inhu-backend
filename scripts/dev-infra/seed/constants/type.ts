import { BookmarkSeedInput } from '@libs/testing/seed/bookmark/type/bookmark-seed.input';
import { MenuSeedInput } from '@libs/testing/seed/menu/type/menu-seed.input';
import { PickedPlaceSeedInput } from '@libs/testing/seed/picked-place/type/picked-place-seed.input';
import { PlaceSeedInput } from '@libs/testing/seed/place/type/place-seed.input';
import { ReviewSeedInput } from '@libs/testing/seed/review/type/review-seed.input';

/**
 * testCase 내부에서 사용할, 의존성이 제거된 타입들
 */
export type MenuTestCaseInput = Omit<MenuSeedInput, 'placeIdx'>;
export type ReviewTestCaseInput = Omit<
  ReviewSeedInput,
  'placeIdx' | 'userIdx'
> & {
  userKey: 'user1' | 'user2';
};
export type BookmarkTestCaseInput = Omit<
  BookmarkSeedInput,
  'placeIdx' | 'userIdx'
> & {
  userKey: 'user1' | 'user2';
};
export type PickedPlaceTestCaseInput = Omit<PickedPlaceSeedInput, 'placeIdx'>;

/**
 * 장소를 시딩하기 위한 데이터 타입
 */
export type PlaceSeedData = PlaceSeedInput & {
  reviewList: ReviewTestCaseInput[];
  menuList: MenuTestCaseInput[];
  pickedPlaceList: PickedPlaceTestCaseInput[];
};
