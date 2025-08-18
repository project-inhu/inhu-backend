import { ReviewSeedInput } from '@libs/testing/seed/review/type/review-seed.input';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

/**
 * Review 시드 출력 타입 정의
 *
 * @publicApi
 */
export type ReviewSeedOutput = FilledSeedInput<ReviewSeedInput> & {
  idx: number;
};
