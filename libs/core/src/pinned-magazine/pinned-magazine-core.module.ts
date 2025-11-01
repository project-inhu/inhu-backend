import { Module } from '@nestjs/common';
import { PinnedMagazineCoreService } from './pinned-magazine-core.service';
import { PinnedMagazineCoreRepository } from './pinned-magazine-core.repository';

@Module({
  providers: [PinnedMagazineCoreService, PinnedMagazineCoreRepository],
  exports: [PinnedMagazineCoreService],
})
export class PinnedMagazineCoreModule {}
