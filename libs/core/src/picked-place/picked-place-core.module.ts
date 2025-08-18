import { PickedPlaceCoreRepository } from './picked-place-core.repository';
import { PickedPlaceCoreService } from './picked-place-core.service';
import { Module } from '@nestjs/common';

/**
 * PickedPlaceCoreModule 클래스
 *
 * @publicApi
 */
@Module({
  providers: [PickedPlaceCoreService, PickedPlaceCoreRepository],
  exports: [PickedPlaceCoreService],
})
export class PickedPlaceCoreModule {}
