import { ReviewSeedInput } from '@libs/testing/seed/review/type/review-seed.input';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

export type ReviewSeedOutput = FilledSeedInput<ReviewSeedInput> & {
  idx: number;
};
