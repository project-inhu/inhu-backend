import { Module } from '@nestjs/common';
import { BannerCoreModule } from '@libs/core/banner/banner-core.module';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  imports: [BannerCoreModule],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [],
})
export class BannerModule {}
