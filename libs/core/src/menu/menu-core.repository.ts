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
      orderBy: [{ sortOrder: 'asc' }, { idx: order || 'asc' }],
      take,
      skip,
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

  public async softDeleteMenuByIdx(idx: number): Promise<void> {
    await this.txHost.tx.menu.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }
}
