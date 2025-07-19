import { SeedOutput } from '@libs/common';
import { UserSeedInput } from '@libs/testing/seed/user/type/user-seed.input';

export type UserSeedOutput = SeedOutput<UserSeedInput> & {
  idx: number;
};
