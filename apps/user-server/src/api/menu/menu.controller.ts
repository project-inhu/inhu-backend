import { Exception } from '@libs/common/decorator/exception.decorator';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetMenuByPlaceIdxDto } from '@user/api/menu/dto/request/get-menu-by-place-idx.dto';
import { GetMenuByPlaceIdxResponseDto } from '@user/api/menu/dto/response/get-menu-by-place-idx-response.dto';
import { MenuService } from '@user/api/menu/menu.service';

@Controller()
@ApiTags('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 메뉴 목록 보기
   */
  @Get('/place/:placeIdx/menu')
  @Exception(400, 'Invalid placeIdx')
  public async getMenuList(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Query() dto: GetMenuByPlaceIdxDto,
  ): Promise<GetMenuByPlaceIdxResponseDto> {
    return await this.menuService.getMenuByPlaceIdx(placeIdx, dto);
  }
}
