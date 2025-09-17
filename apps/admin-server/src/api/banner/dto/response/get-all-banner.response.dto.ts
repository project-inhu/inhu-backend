import { BannerEntity } from '../../entity/banner.entity';

export class GetAllBannerResponseDto {
  bannerList: BannerEntity[];
  hasNext: boolean;
}
