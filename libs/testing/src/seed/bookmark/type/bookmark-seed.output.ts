import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { BookmarkSeedInput } from './bookmark-seed.input';

/**
 * Bookmark 시드 출력 타입 정의
 *
 * @publicApi
 */
export type BookmarkSeedOutput = FilledSeedInput<BookmarkSeedInput>;
