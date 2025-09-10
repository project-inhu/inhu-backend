import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { PlaceOwnerSeedInput } from './place-owner-seed.input';

/**
 * 사장님 시드 출력 타입 정의
 *
 * @publicApi
 */
export type PlaceOwnerSeedOutput = FilledSeedInput<PlaceOwnerSeedInput> & {
  id: string;
};
