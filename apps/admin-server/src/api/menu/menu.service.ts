import { MenuCoreService } from '@libs/core';
import { Injectable } from '@nestjs/common';
import { GetAllMenuDto } from './dto/request/get-all-menu.dto';
import { MenuEntity } from './entity/menu.entity';

@Injectable()
export class MenuService {
  constructor(private readonly menuCoreService: MenuCoreService) {}

  public async getAllMenuByPlaceIdx(
    placeIdx: number,
    dto: GetAllMenuDto,
  ): Promise<{ hasNext: boolean; menuList: MenuEntity[] }> {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (dto.page - 1) * pageSize;

    const menuList = await this.menuCoreService.getMenuAllByPlaceIdx({
      placeIdx,
      take,
      skip,
    });

    return {
      menuList: menuList.slice(0, pageSize).map(MenuEntity.fromModel),
      hasNext: menuList.length > pageSize,
    };
  }
}
