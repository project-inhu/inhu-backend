import { FilledSeed } from '@libs/common';
import { PlaceSeedInput } from '@libs/testing/seed/place/type/place-seed.input';

export type PlaceSeedOutput = FilledSeed<PlaceSeedInput> & { idx: number };
