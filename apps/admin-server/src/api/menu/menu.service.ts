import { MenuCoreService, PlaceCoreService } from '@libs/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetAllMenuDto } from './dto/request/get-all-menu.dto';
import { MenuEntity } from './entity/menu.entity';
import { CreateMenuDto } from './dto/request/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly menuCoreService: MenuCoreService,
    private readonly placeCoreService: PlaceCoreService,
  ) {}

  public async getAllMenuByPlaceIdx(
    placeIdx: number,
    dto: GetAllMenuDto,
  ): Promise<{ hasNext: boolean; menuList: MenuEntity[] }> {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (dto.page - 1) * pageSize;

    const menuList = await this.menuCoreService.getMenuAllByPlaceIdx(placeIdx, {
      take,
      skip,
    });

    return {
      menuList: menuList.slice(0, pageSize).map(MenuEntity.fromModel),
      hasNext: menuList.length > pageSize,
    };
  }

  public async createMenuByPlaceIdx(
    placeIdx: number,
    dto: CreateMenuDto,
  ): Promise<MenuEntity> {
    const place = await this.placeCoreService.getPlaceByIdx(placeIdx);

    if (!place) {
      throw new NotFoundException('Cannot find place with given idx');
    }

    const menuModel = await this.menuCoreService.createMenu(placeIdx, {
      name: dto.name,
      price: dto.price,
      content: dto.content,
      imagePath: dto.imagePath,
      isFlexible: dto.isFlexible,
    });

    return MenuEntity.fromModel(menuModel);
  }
}
