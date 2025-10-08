import { Module } from '@nestjs/common';
import { MagazineCoreRepository } from './magazine-core.repository';
import { MagazineCoreService } from './magazine-core.service';

@Module({
  providers: [MagazineCoreRepository, MagazineCoreService],
  exports: [MagazineCoreService],
})
export class MagazineCoreModule {}
