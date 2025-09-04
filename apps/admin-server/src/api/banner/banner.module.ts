import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  imports: [],
  controllers: [BannerController],
  exports: [BannerService],
})
export class BannerModule {}
