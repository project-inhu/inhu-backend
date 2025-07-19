import { PickedPlaceSeedInput } from '@libs/testing/seed/picked-place/type/picked-place-seed.input';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

export type PickedPlaceSeedOutput = FilledSeedInput<PickedPlaceSeedInput> & {
  idx: number;
};
