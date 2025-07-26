import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetAllMenuDto } from './dto/request/get-all-menu.dto';
import { GetAllMenuResponseDto } from './dto/response/get-all-menu.response.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 메뉴 목록 보기
   */
  @AdminAuth()
  @Exception(400, 'Invalid placeIdx or request body')
  @Get('/place/:placeIdx/menu')
  public async getAllMenu(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Query() dto: GetAllMenuDto,
  ): Promise<GetAllMenuResponseDto> {
    return await this.menuService.getAllMenuByPlaceIdx(placeIdx, dto);
  }
}
