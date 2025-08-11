import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { MenuSeedInput } from './type/menu-seed.input';
import { MenuSeedOutput } from './type/menu-seed.output';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { faker } from '@faker-js/faker';
import { defaultValue } from '@libs/common/utils/default-value.util';

/**
 * Menu 시드 헬퍼 클래스
 *
 * @publicApi
 */
export class MenuSeedHelper extends ISeedHelper<MenuSeedInput, MenuSeedOutput> {
  public generateFilledInputValue(
    input: MenuSeedInput,
  ): FilledSeedInput<MenuSeedInput> {
    return {
      placeIdx: input.placeIdx,
      name: defaultValue(
        input.name,
        faker.word.noun({ length: { min: 5, max: 20 } }),
      ),
      content: defaultValue(input.content, null),
      price: defaultValue(input.price, 0),
      imagePath: defaultValue(input.imagePath, null),
      isFlexible: defaultValue(input.isFlexible, false),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }

  public async seed(input: MenuSeedInput): Promise<MenuSeedOutput> {
    const filledInput = this.generateFilledInputValue(input);
    const menuCount = await this.prisma.menu.count({
      where: { placeIdx: filledInput.placeIdx },
    });

    const menu = await this.prisma.menu.create({
      select: { idx: true, sortOrder: true },
      data: {
        placeIdx: filledInput.placeIdx,
        name: filledInput.name,
        content: filledInput.content,
        price: filledInput.price,
        imagePath: filledInput.imagePath,
        isFlexible: filledInput.isFlexible,
        sortOrder: menuCount + 1,
        deletedAt: filledInput.deletedAt,
      },
    });

    return {
      idx: menu.idx,
      sortOrder: menu.sortOrder,
      ...filledInput,
    };
  }
}
