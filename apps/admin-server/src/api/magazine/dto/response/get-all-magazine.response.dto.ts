import { MagazineEntity } from '../../entity/magazine.entity';

export class GetAllMagazineResponseDto {
  magazineList: MagazineEntity[];
  hasNext: boolean;
}
