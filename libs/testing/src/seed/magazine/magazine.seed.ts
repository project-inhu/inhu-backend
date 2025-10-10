import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { MagazineSeedInput } from './type/magazine-seed.input';
import { MagazineSeedOutput } from './type/magazine-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';

/**
 * magazine 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class MagazineSeedHelper extends ISeedHelper<
  MagazineSeedInput,
  MagazineSeedOutput
> {
  public generateFilledInputValue(
    input: MagazineSeedInput,
  ): FilledSeedInput<MagazineSeedInput> {
    return {
      title: defaultValue(input.title, faker.lorem.sentence()),
      content: defaultValue(input.content, faker.lorem.paragraphs()),
      thumbnailPath: defaultValue(input.thumbnailPath, null),
      isTitleVisible: defaultValue(input.isTitleVisible, false),
      activatedAt: defaultValue(input.activatedAt, null),
      deletedAt: defaultValue(input.deletedAt, null),
      placeIdxList: defaultValue(input.placeIdxList, null),
    };
  }

  public async seed(input: MagazineSeedInput): Promise<MagazineSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const magazine = await this.prisma.magazine.create({
      select: { idx: true },
      data: {
        title: filledInput.title,
        content: filledInput.content,
        thumbnailImagePath: filledInput.thumbnailPath,
        isTitleVisible: filledInput.isTitleVisible,
        activatedAt: filledInput.activatedAt,
        deletedAt: filledInput.deletedAt,
        placeList: filledInput.placeIdxList
          ? {
              createMany: {
                data: filledInput.placeIdxList.map((placeIdx) => ({
                  placeIdx,
                })),
              },
            }
          : undefined,
      },
    });

    return {
      idx: magazine.idx,
      ...filledInput,
    };
  }
}
