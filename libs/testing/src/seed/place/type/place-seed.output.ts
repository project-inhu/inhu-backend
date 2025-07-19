import { PlaceSeedInput } from '@libs/testing/seed/place/type/place-seed.input';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

export type PlaceSeedOutput = FilledSeedInput<PlaceSeedInput> & { idx: number };
