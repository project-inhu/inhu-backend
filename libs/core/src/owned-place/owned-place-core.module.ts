import { Module } from '@nestjs/common';
import { OwnedPlaceCoreService } from './owned-place-core.service';
import { OwnedPlaceCoreRepository } from './owned-place-core.repository';

/**
 * 소유지 코어 모듈
 *
 * @publicApi
 */
@Module({
  providers: [OwnedPlaceCoreService, OwnedPlaceCoreRepository],
  exports: [OwnedPlaceCoreService],
})
export class OwnedPlaceCoreModule {}
