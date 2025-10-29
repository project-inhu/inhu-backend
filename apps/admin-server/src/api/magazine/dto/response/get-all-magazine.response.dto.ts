import { MagazineOverviewEntity } from '../../entity/magazine-overview.entity';

export class GetAllMagazineResponseDto {
  magazineList: MagazineOverviewEntity[];
  count: number;
}
