import { PinnedMagazineCoreModule } from '@libs/core/pinned-magazine/pinned-magazine-core.module';
import { Module } from '@nestjs/common';
import { PinnedMagazineController } from './pinned-magazine.controller';
import { PinnedMagazineService } from './pinned-magazine.service';
import { MagazineLikeCoreModule } from '@libs/core/magazine-like/magazine-like-core.module';

@Module({
  imports: [PinnedMagazineCoreModule, MagazineLikeCoreModule],
  controllers: [PinnedMagazineController],
  providers: [PinnedMagazineService],
  exports: [PinnedMagazineService],
})
export class PinnedMagazineModule {}
