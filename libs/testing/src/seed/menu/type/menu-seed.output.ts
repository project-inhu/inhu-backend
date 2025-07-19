import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { MenuSeedInput } from './menu-seed.input';

export type MenuSeedOutput = FilledSeedInput<MenuSeedInput> & { idx: number };
