import { Module } from '@nestjs/common';
import { PlaceCoreService } from './place-core.service';
import { PlaceCoreRepository } from './place-core.repository';

@Module({
  providers: [PlaceCoreService, PlaceCoreRepository],
  exports: [PlaceCoreService],
})
export class PlaceCoreModule {}
