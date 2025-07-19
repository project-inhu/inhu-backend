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
    };
  }

  public async seed(
    input: PickedPlaceSeedInput,
  ): Promise<FilledSeedInput<PickedPlaceSeedInput>> {
    const { placeIdx, title, content } = this.generateFilledInputValue(input);

    await this.prisma.pickedPlace.create({
      data: {
        title,
        content,
        placeIdx,
      },
    });

    return { placeIdx, title, content };
  }
}
