import { Module } from '@nestjs/common';
import { MagazineLikeCoreRepository } from './magazine-like-core.repository';
import { MagazineLikeCoreService } from './magazine-like-core.service';

@Module({
  providers: [MagazineLikeCoreRepository, MagazineLikeCoreService],
  exports: [MagazineLikeCoreService],
})
export class MagazineLikeCoreModule {}
