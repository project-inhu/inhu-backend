import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { MenuSeedInput } from './menu-seed.input';

/**
 * Menu 시드 출력 타입 정의
 *
 * @publicApi
 */
export type MenuSeedOutput = FilledSeedInput<MenuSeedInput> & {
  idx: number;
  sortOrder: number;
};
