import { MenuCoreService } from '@libs/core';
import { Injectable } from '@nestjs/common';
import { GetMenuByPlaceIdxDto } from '@user/api/menu/dto/request/get-menu-by-place-idx.dto';
import { MenuEntity } from '@user/api/menu/entity/menu.entity';

@Injectable()
export class MenuService {
  constructor(private readonly menuCoreService: MenuCoreService) {}

  public async getMenuByPlaceIdx(
    placeIdx: number,
    dto: GetMenuByPlaceIdxDto,
  ): Promise<{ hasNext: boolean; menuList: MenuEntity[] }> {
    const TAKE = 10;
    const SKIP = (dto.page - 1) * TAKE;

    const menuList = await this.menuCoreService.getMenuAllByPlaceIdx({
      placeIdx,
      take: TAKE + 1,
      skip: SKIP,
    });

    return {
      menuList: menuList.slice(0, TAKE).map(MenuEntity.fromModel),
      hasNext: menuList.length > TAKE,
    };
  }
}
