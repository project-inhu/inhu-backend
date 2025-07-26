import { MenuEntity } from '../../entity/menu.entity';

export class GetAllMenuResponseDto {
  menuList: MenuEntity[];
  hasNext: boolean;
}
