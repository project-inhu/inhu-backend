import { Module } from '@nestjs/common';
import { PinnedMagazineController } from './pinned-magazine.controller';
import { PinnedMagazineService } from './pinned-magazine.service';
import { MagazineCoreModule } from '@libs/core/magazine/magazine-core.module';

@Module({
  imports: [MagazineCoreModule],
  controllers: [PinnedMagazineController],
  providers: [PinnedMagazineService],
  exports: [PinnedMagazineService],
})
export class PinnedMagazineModule {}
