import { PickedPlaceCoreRepository } from './picked-place-core.repository';
import { PickedPlaceCoreService } from './picked-place-core.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [PickedPlaceCoreService, PickedPlaceCoreRepository],
  exports: [PickedPlaceCoreService],
})
export class PickedPlaceCoreModule {}
