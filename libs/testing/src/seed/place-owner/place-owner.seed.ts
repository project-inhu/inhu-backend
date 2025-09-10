import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { defaultValue } from '@libs/common/utils/default-value.util';
import { PlaceOwnerSeedInput } from './type/place-owner-seed.input';
import { PlaceOwnerSeedOutput } from './type/place-owner-seed.output';

/**
 * 사장님 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class PlaceOwnerSeedHelper extends ISeedHelper<
  PlaceOwnerSeedInput,
  PlaceOwnerSeedOutput
> {
  public generateFilledInputValue(
    input: PlaceOwnerSeedInput,
  ): FilledSeedInput<PlaceOwnerSeedInput> {
    return {
      placeIdx: input.placeIdx,
      userIdx: input.userIdx,
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(input: PlaceOwnerSeedInput): Promise<PlaceOwnerSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);

    const placeOwner = await this.prisma.placeOwner.create({
      select: { id: true },
      data: {
        placeIdx: filledInput.placeIdx,
        userIdx: filledInput.userIdx,
        deletedAt: filledInput.deletedAt,
      },
    });

    return {
      id: placeOwner.id,
      ...filledInput,
    };
  }
}
