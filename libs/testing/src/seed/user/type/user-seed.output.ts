import { FilledSeed } from '@libs/common';
import { UserSeedInput } from '@libs/testing/seed/user/type/user-seed.input';

export type UserSeedOutput = FilledSeed<UserSeedInput> & {
  idx: number;
};
