import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { MagazineLikeSeedInput } from './type/magazine-like-seed.input';
import { MagazineLikeSeedOutput } from './type/magazine-lke-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

export class MagazineLikeSeedHelper extends ISeedHelper<
  MagazineLikeSeedInput,
  MagazineLikeSeedOutput
> {
  public generateFilledInputValue(
    input: MagazineLikeSeedInput,
  ): FilledSeedInput<MagazineLikeSeedInput> {
    return {
      magazineIdx: input.magazineIdx,
      userIdx: input.userIdx,
    };
  }

  public async seed(
    input: MagazineLikeSeedInput,
  ): Promise<MagazineLikeSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const magazineLike = await this.prisma.magazineLike.create({
      data: {
        magazineIdx: filledInput.magazineIdx,
        userIdx: filledInput.userIdx,
      },
    });

    await this.prisma.magazine.update({
      where: { idx: filledInput.magazineIdx },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    return { ...magazineLike };
  }
}
