import { Injectable } from '@nestjs/common';
import { BannerCoreRepository } from './banner-core.repository';

/**
 * BannerCoreService 클래스
 *
 * @publicApi
 */
@Injectable()
export class BannerCoreService {
  constructor(private readonly bannerRepository: BannerCoreRepository) {}
}
