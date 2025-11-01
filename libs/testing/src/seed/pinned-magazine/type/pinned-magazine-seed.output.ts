import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { PinnedMagazineSeedInput } from './pinned-magazine-seed.input';

export type PinnedMagazineSeedOutput =
  FilledSeedInput<PinnedMagazineSeedInput> & {
    createdAt: Date;
  };
