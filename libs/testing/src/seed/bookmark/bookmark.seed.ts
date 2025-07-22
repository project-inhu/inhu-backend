import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { BookmarkSeedInput } from './type/bookmark-seed.input';
import { BookmarkSeedOutput } from './type/bookmark-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

export class BookmarkSeedHelper extends ISeedHelper<
  BookmarkSeedInput,
  BookmarkSeedOutput
> {
  public generateFilledInputValue(
    input: BookmarkSeedInput,
  ): FilledSeedInput<BookmarkSeedInput> {
    return {
      userIdx: input.userIdx,
      placeIdx: input.placeIdx,
    };
  }

  public async seed(input: BookmarkSeedInput): Promise<BookmarkSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    return await this.prisma.bookmark.create({
      data: {
        userIdx: filledInput.userIdx,
        placeIdx: filledInput.placeIdx,
      },
    });
  }
}
