import { UserSeedInput } from '@libs/testing/seed/user/type/user-seed.input';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

/**
 * 유저 시드 출력 타입 정의
 *
 * @publicApi
 */
export type UserSeedOutput = FilledSeedInput<UserSeedInput> & {
  idx: number;
};
