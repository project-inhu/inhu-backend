import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { GetMenuAllInput } from './inputs/get-menu-all.input';
import { SelectMenu } from './model/prisma-type/select-menu';
import { CreateMenuInput } from './inputs/create-menu.input';
import { UpdateMenuInput } from './inputs/update-menu.input';

@Injectable()
export class MenuCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectMenuByIdx(idx: number): Promise<SelectMenu | null> {
    return await this.txHost.tx.menu.findUnique({
      select: {
        idx: true,
        placeIdx: true,
        name: true,
        price: true,
        content: true,
        imagePath: true,
        isFlexible: true,
        createdAt: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectMenuAllByPlaceIdx({
    placeIdx,
    take,
    skip,
  }: GetMenuAllInput): Promise<SelectMenu[]> {
    return await this.txHost.tx.menu.findMany({
      select: {
        idx: true,
        placeIdx: true,
        name: true,
        price: true,
        content: true,
        imagePath: true,
        isFlexible: true,
        createdAt: true,
      },
      where: {
        placeIdx,
        deletedAt: null,
      },
      orderBy: {
        idx: 'asc',
      },
      take,
      skip,
    });
  }

  public async insertMenu(input: CreateMenuInput): Promise<SelectMenu> {
    return await this.txHost.tx.menu.create({
      select: {
        idx: true,
        placeIdx: true,
        name: true,
        price: true,
        content: true,
        imagePath: true,
        isFlexible: true,
        createdAt: true,
      },
      data: {
        placeIdx: input.placeIdx,
        name: input.name,
        price: input.price,
        content: input.content,
        imagePath: input.imagePath,
        isFlexible: input.isFlexible,
      },
    });
  }

  public async updateMenuByIdx(
    idx: number,
    input: UpdateMenuInput,
  ): Promise<void> {
    await this.txHost.tx.menu.update({
      data: {
        placeIdx: input.placeIdx,
        name: input.name,
        price: input.price,
        content: input.content,
        imagePath: input.imagePath,
        isFlexible: input.isFlexible,
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
