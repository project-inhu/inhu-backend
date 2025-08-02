import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetAllMenuDto } from './dto/request/get-all-menu.dto';
import { GetAllMenuResponseDto } from './dto/response/get-all-menu.response.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { MenuEntity } from './entity/menu.entity';
import { CreateMenuDto } from './dto/request/create-menu.dto';
import { UpdateMenuDto } from './dto/request/update-menu.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 메뉴 목록 보기
   */
  @AdminAuth()
  @Exception(400, 'Invalid placeIdx or query parameters')
  @Get('/place/:placeIdx/menu')
  public async getAllMenu(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Query() dto: GetAllMenuDto,
  ): Promise<GetAllMenuResponseDto> {
    return await this.menuService.getAllMenuByPlaceIdx(placeIdx, dto);
  }

  /**
   * 메뉴 생성
   */
  @AdminAuth()
  @Exception(400, 'Invalid placeIdx or request body')
  @Post('/place/:placeIdx/menu')
  public async createMenu(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() dto: CreateMenuDto,
  ): Promise<MenuEntity> {
    return await this.menuService.createMenuByPlaceIdx(placeIdx, dto);
  }

  /**
   * 메뉴 수정
   */
  @AdminAuth()
  @Exception(400, 'Invalid menuIdx or request body')
  @Exception(404, 'Menu does not exist')
  @Put('/menu/:menuIdx')
  public async updateMenu(
    @Param('menuIdx', ParseIntPipe) menuIdx: number,
    @Body() dto: UpdateMenuDto,
  ): Promise<void> {
    return await this.menuService.updateMenuByPlaceIdx(menuIdx, dto);
  }

  /**
   * 메뉴 삭제
   */
  @AdminAuth()
  @Exception(400, 'Invalid menuIdx')
  @Exception(404, 'Menu does not exist')
  @Delete('/menu/:menuIdx')
  public async deleteMenu(
    @Param('menuIdx', ParseIntPipe) menuIdx: number,
  ): Promise<void> {
    return await this.menuService.deleteMenuByIdx(menuIdx);
  }
}
