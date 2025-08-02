import { PickedPlaceSeedInput } from '@libs/testing/seed/picked-place/type/picked-place-seed.input';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

/**
 * Picked place 시드 출력 타입 정의
 *
 * @publicApi
 */
export type PickedPlaceSeedOutput = FilledSeedInput<PickedPlaceSeedInput> & {
  idx: number;
};
