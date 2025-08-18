import { Module } from '@nestjs/common';
import { PlaceCoreService } from './place-core.service';
import { PlaceCoreRepository } from './place-core.repository';
import { DateUtilModule } from '@libs/common/modules/date-util/date-util.module';

/**
 * 장소 관련 핵심 모듈
 *
 * @publicApi
 */
@Module({
  imports: [DateUtilModule],
  providers: [PlaceCoreService, PlaceCoreRepository],
  exports: [PlaceCoreService],
})
export class PlaceCoreModule {}
