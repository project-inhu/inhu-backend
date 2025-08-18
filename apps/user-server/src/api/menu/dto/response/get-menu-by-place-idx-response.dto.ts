import { MenuEntity } from '@user/api/menu/entity/menu.entity';

export class GetMenuByPlaceIdxResponseDto {
  menuList: MenuEntity[];
  hasNext: boolean;
}
