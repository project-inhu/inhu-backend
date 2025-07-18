import { Injectable } from '@nestjs/common';
import { MenuCoreRepository } from './menu-core.repository';
import { GetMenuAllInput } from './inputs/get-menu-all.input';
import { MenuModel } from './model/menu.model';
import { CreateMenuInput } from './inputs/create-menu.input';
import { UpdateMenuInput } from './inputs/update-menu.input';

@Injectable()
export class MenuCoreService {
  constructor(private readonly menuCoreRepository: MenuCoreRepository) {}

  public async getMenuByIdx(idx: number): Promise<MenuModel | null> {
    const menu = await this.menuCoreRepository.selectMenuByIdx(idx);
    return menu && MenuModel.fromPrisma(menu);
  }

  public async getMenuAllByPlaceIdx(
    input: GetMenuAllInput,
  ): Promise<MenuModel[]> {
    return (await this.menuCoreRepository.selectMenuAllByPlaceIdx(input)).map(
      MenuModel.fromPrisma,
    );
  }

  public async createMenu(input: CreateMenuInput): Promise<MenuModel> {
    return MenuModel.fromPrisma(
      await this.menuCoreRepository.insertMenu(input),
    );
  }

  public async updateMenuByIdx(
    idx: number,
    input: UpdateMenuInput,
  ): Promise<void> {
    return await this.menuCoreRepository.updateMenuByIdx(idx, input);
  }

  public async deleteMenuByIdx(idx: number): Promise<void> {
    return await this.menuCoreRepository.softDeleteMenuByIdx(idx);
  }
}
