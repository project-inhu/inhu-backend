import { MagazineOverviewEntity } from '../../entity/magazine-overview.entity';

export class GetAllLikedMagazineResponseDto {
  magazineList: MagazineOverviewEntity[];
  hasNext: boolean;
}
