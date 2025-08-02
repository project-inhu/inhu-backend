import { PlaceSeedInput } from '@libs/testing/seed/place/type/place-seed.input';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

/**
 * place 시드 출력 타입 정의
 *
 * @publicApi
 */
export type PlaceSeedOutput = FilledSeedInput<PlaceSeedInput> & { idx: number };
