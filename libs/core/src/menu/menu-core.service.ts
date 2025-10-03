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
import { Locker } from '@libs/common/decorator/locker.decorator';

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

  // TODO: menuReviewModel 존재 유무 판단인데 menuModel 리턴. 변경 필요
  public async getMenuReviewByMenuIdxAndReviewIdx(
    menuIdx: number,
    reviewIdx: number,
  ): Promise<MenuModel | null> {
    const menu =
      await this.menuCoreRepository.selectMenuReviewByMenuIdxAndReviewIdx(
        menuIdx,
        reviewIdx,
      );
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

  public async createMenuReview(
    reviewIdx: number,
    menuIdx: number,
  ): Promise<void> {
    await this.menuCoreRepository.insertMenuReview(reviewIdx, menuIdx);
  }

  public async updateMenuByIdx(
    idx: number,
    input: UpdateMenuInput,
  ): Promise<void> {
    return await this.menuCoreRepository.updateMenuByIdx(idx, input);
  }

  @Transactional()
  @Locker({ key: 'menu_sort_order' })
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

    if (currentSortOrder < newSortOrder) {
      await this.menuCoreRepository.incrementManyMenuSortOrderByPlaceIdx(
        -1,
        menu.placeIdx,
        'gt',
        currentSortOrder,
        'lte',
        newSortOrder,
      );
    } else {
      await this.menuCoreRepository.incrementManyMenuSortOrderByPlaceIdx(
        1,
        menu.placeIdx,
        'gte',
        newSortOrder,
        'lt',
        currentSortOrder,
      );
    }

    return await this.menuCoreRepository.updateMenuSortOrderByIdx(
      idx,
      newSortOrder,
    );
  }

  @Transactional()
  public async deleteMenuByIdx(idx: number): Promise<void> {
    return await this.menuCoreRepository.softDeleteMenuByIdx(idx);
  }

  public async deleteMenuReviewByReviewIdxAndMenuIdx(
    reviewIdx: number,
    menuIdx: number,
  ): Promise<void> {
    return await this.menuCoreRepository.deleteMenuReviewByReviewIdxAndMenuIdx(
      reviewIdx,
      menuIdx,
    );
  }
}
