import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { GetMenuAllInput } from './inputs/get-menu-all.input';
import { SELECT_MENU, SelectMenu } from './model/prisma-type/select-menu';
import { CreateMenuInput } from './inputs/create-menu.input';
import { UpdateMenuInput } from './inputs/update-menu.input';

@Injectable()
export class MenuCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectMenuByIdx(idx: number): Promise<SelectMenu | null> {
    return await this.txHost.tx.menu.findUnique({
      ...SELECT_MENU,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectMenuAllByPlaceIdx(
    placeIdx: number,
    { take, skip, order }: GetMenuAllInput,
  ): Promise<SelectMenu[]> {
    return await this.txHost.tx.menu.findMany({
      ...SELECT_MENU,
      where: {
        placeIdx,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: order || 'desc',
      },
      take,
      skip,
    });
  }

  public async getMenuCountByPlaceIdx(placeIdx: number): Promise<number> {
    return await this.txHost.tx.menu.count({
      where: { placeIdx, deletedAt: null },
    });
  }

  public async insertMenu(
    placeIdx: number,
    { name, price, content, imagePath, isFlexible }: CreateMenuInput,
  ): Promise<SelectMenu> {
    return await this.txHost.tx.menu.create({
      ...SELECT_MENU,
      data: {
        placeIdx,
        name,
        price,
        content,
        imagePath,
        isFlexible,
        sortOrder: (await this.getMenuCountByPlaceIdx(placeIdx)) + 1,
      },
    });
  }

  public async updateMenuByIdx(
    idx: number,
    { name, price, content, imagePath, isFlexible }: UpdateMenuInput,
  ): Promise<void> {
    await this.txHost.tx.menu.update({
      data: {
        name,
        price,
        content,
        imagePath,
        isFlexible,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async incrementManyMenuSortOrderByPlaceIdx(
    increment: number,
    placeIdx: number,
    compare?: 'gt' | 'gte',
    comparisonValue?: number,
    compare2?: 'lt' | 'lte',
    comparisonValue2?: number,
  ): Promise<void> {
    const sortOrder: Record<string, number> = {};
    if (compare && comparisonValue !== undefined)
      sortOrder[compare] = comparisonValue;
    if (compare2 && comparisonValue2 !== undefined)
      sortOrder[compare2] = comparisonValue2;

    await this.txHost.tx.menu.updateMany({
      data: {
        sortOrder: {
          increment,
        },
      },
      where: {
        placeIdx,
        sortOrder,
        deletedAt: null,
      },
    });
  }

  public async updateMenuSortOrderByIdx(
    idx: number,
    newSortOrder: number,
  ): Promise<void> {
    await this.txHost.tx.menu.update({
      where: { idx },
      data: { sortOrder: newSortOrder },
    });
  }

  // ! soft delete 해제 시, sortOrder는 맨 뒷번호를 할당해야 함.
  public async softDeleteMenuByIdx(idx: number): Promise<void> {
    const menu = await this.txHost.tx.menu.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        idx,
        deletedAt: null,
      },
    });

    await this.incrementManyMenuSortOrderByPlaceIdx(
      -1,
      menu.placeIdx,
      'gt',
      menu.sortOrder,
    );
  }
}
