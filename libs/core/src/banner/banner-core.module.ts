import { Module } from '@nestjs/common';
import { BannerCoreService } from './banner-core.service';
import { BannerCoreRepository } from './banner-core.repository';

/**
 * BannerCoreModule 클래스
 *
 * @publicApi
 */
@Module({
  imports: [],
  providers: [BannerCoreService, BannerCoreRepository],
  exports: [BannerCoreService],
})
export class BannerCoreModule {}
