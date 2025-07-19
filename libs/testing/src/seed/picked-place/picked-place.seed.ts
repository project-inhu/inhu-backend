import { faker } from '@faker-js/faker/.';
import { defaultValue } from '@libs/common';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { PickedPlaceSeedInput } from '@libs/testing/seed/picked-place/type/picked-place-seed.input';
import { PickedPlaceSeedOutput } from '@libs/testing/seed/picked-place/type/picked-place-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

export class PickedPlaceSeedHelper extends ISeedHelper<
  PickedPlaceSeedInput,
  PickedPlaceSeedOutput
> {
  public generateFilledInputValue(
    input: PickedPlaceSeedInput,
  ): FilledSeedInput<PickedPlaceSeedInput> {
    return {
      placeIdx: input.placeIdx,
      title: defaultValue(input.title, faker.lorem.sentence(3)),
      content: defaultValue(input.content, faker.lorem.paragraph(1)),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(
    input: PickedPlaceSeedInput,
  ): Promise<PickedPlaceSeedOutput> {
    const { placeIdx, title, content, deletedAt } =
      this.generateFilledInputValue(input);

    const pickedPlace = await this.prisma.pickedPlace.create({
      select: { idx: true },
      data: {
        title,
        content,
        placeIdx,
        deletedAt,
      },
    });

    return { idx: pickedPlace.idx, placeIdx, title, content, deletedAt };
  }
}
