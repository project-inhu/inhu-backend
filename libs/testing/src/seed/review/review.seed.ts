import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { ReviewSeedInput } from './type/review-seed.input';
import { ReviewSeedOutput } from './type/review-seed.output';
import { defaultValue } from '@libs/common';
import { faker } from '@faker-js/faker';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

export class ReviewSeedHelper extends ISeedHelper<
  ReviewSeedInput,
  ReviewSeedOutput
> {
  public generateFilledInputValue(
    input: ReviewSeedInput,
  ): FilledSeedInput<ReviewSeedInput> {
    return {
      userIdx: input.userIdx,
      placeIdx: input.placeIdx,
      deletedAt: defaultValue(input.deletedAt, null),
      content: defaultValue(input.content, faker.lorem.paragraph()),
      reviewImgList: defaultValue(input.reviewImgList, null),
      keywordIdxList: defaultValue(input.keywordIdxList, null),
    };
  }

  public async seed(input: ReviewSeedInput): Promise<ReviewSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const review = await this.prisma.review.create({
      select: { idx: true },
      data: {
        content: filledInput.content,
        reviewImageList: filledInput.reviewImgList
          ? {
              createMany: {
                data: filledInput.reviewImgList.map((path) => ({ path })),
              },
            }
          : undefined,
        reviewKeywordMappingList: filledInput.keywordIdxList
          ? {
              createMany: {
                data: filledInput.keywordIdxList.map((keywordIdx) => ({
                  keywordIdx,
                })),
              },
            }
          : undefined,
        user: { connect: { idx: filledInput.userIdx } },
        place: { connect: { idx: filledInput.placeIdx } },
      },
    });

    return { idx: review.idx, ...filledInput };
  }
}
