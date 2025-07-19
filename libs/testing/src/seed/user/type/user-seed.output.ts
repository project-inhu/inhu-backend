import { UserSeedInput } from '@libs/testing/seed/user/type/user-seed.input';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

export type UserSeedOutput = FilledSeedInput<UserSeedInput> & {
  idx: number;
};
