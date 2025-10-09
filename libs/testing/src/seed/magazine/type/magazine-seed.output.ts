import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { MagazineSeedInput } from './magazine-seed.input';

/**
 * magazine 시드 출력 타입정의
 *
 * @publicApi
 */
export type MagazineSeedOutput = FilledSeedInput<MagazineSeedInput> & {
  idx: number;
};
