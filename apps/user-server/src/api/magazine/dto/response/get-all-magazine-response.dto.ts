import { MagazineOverviewEntity } from '../../entity/magazine-overview.entity';

export class GetAllMagazineResponseDto {
  magazineList: MagazineOverviewEntity[];
  hasNext: boolean;
}
