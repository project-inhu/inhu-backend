import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { PinnedMagazineSeedInput } from './type/pinned-magazine-seed.input';
import { PinnedMagazineSeedOutput } from './type/pinned-magazine-seed.output';

/**
 * magazine 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class PinnedMagazineSeedHelper extends ISeedHelper<
  PinnedMagazineSeedInput,
  PinnedMagazineSeedOutput
> {
  public generateFilledInputValue(
    input: PinnedMagazineSeedInput,
  ): FilledSeedInput<PinnedMagazineSeedInput> {
    return {
      idx: input.idx,
    };
  }

  public async seed(
    input: PinnedMagazineSeedInput,
  ): Promise<PinnedMagazineSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const pinnedMagazine = await this.prisma.pinnedMagazine.create({
      select: { idx: true, createdAt: true },
      data: {
        idx: filledInput.idx,
      },
    });

    return {
      ...filledInput,
      createdAt: pinnedMagazine.createdAt,
    };
  }
}
