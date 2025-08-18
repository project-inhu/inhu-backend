import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { MenuCoreRepository } from './menu-core.repository';
import { GetMenuAllInput } from './inputs/get-menu-all.input';
import { MenuModel } from './model/menu.model';
import { CreateMenuInput } from './inputs/create-menu.input';
import { UpdateMenuInput } from './inputs/update-menu.input';

/**
 * MenuCoreService 클래스
 *
 * @publicApi
 */
@Injectable()
export class MenuCoreService {
  constructor(private readonly menuCoreRepository: MenuCoreRepository) {}

  public async getMenuByIdx(idx: number): Promise<MenuModel | null> {
    const menu = await this.menuCoreRepository.selectMenuByIdx(idx);
    return menu && MenuModel.fromPrisma(menu);
  }

  public async getMenuAllByPlaceIdx(
    idx: number,
    input: GetMenuAllInput,
  ): Promise<MenuModel[]> {
    return await this.menuCoreRepository
      .selectMenuAllByPlaceIdx(idx, input)
      .then((menus) => menus.map(MenuModel.fromPrisma));
  }

  public async getMenuCountByPlaceIdx(idx: number): Promise<number> {
    return await this.menuCoreRepository.getMenuCountByPlaceIdx(idx);
  }

  public async createMenu(
    idx: number,
    input: CreateMenuInput,
  ): Promise<MenuModel> {
    return await this.menuCoreRepository
      .insertMenu(idx, input)
      .then(MenuModel.fromPrisma);
  }

  public async updateMenuByIdx(
    idx: number,
    input: UpdateMenuInput,
  ): Promise<void> {
    return await this.menuCoreRepository.updateMenuByIdx(idx, input);
  }

  // TODO: race condition 해결해야 함
  @Transactional()
  public async updateMenuSortOrderByIdx(
    idx: number,
    newSortOrder: number,
  ): Promise<void> {
    const menu = await this.menuCoreRepository.selectMenuByIdx(idx);
    if (!menu) {
      throw new NotFoundException('Cannot find menu with given idx');
    }

    const menuCount = await this.menuCoreRepository.getMenuCountByPlaceIdx(
      menu.placeIdx,
    );
    if (newSortOrder > menuCount) {
      throw new BadRequestException('Invalid sort order');
    }

    const currentSortOrder = menu.sortOrder;
    if (currentSortOrder === newSortOrder) {
      return;
    }

    return await this.menuCoreRepository.updateMenuSortOrderByIdx(
      idx,
      menu.placeIdx,
      currentSortOrder,
      newSortOrder,
    );
  }

  @Transactional()
  public async deleteMenuByIdx(idx: number): Promise<void> {
    return await this.menuCoreRepository.softDeleteMenuByIdx(idx);
  }
}
