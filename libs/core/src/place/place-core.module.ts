import { Logger, Module } from '@nestjs/common';
import { PlaceCoreService } from './place-core.service';
import { PlaceCoreRepository } from './place-core.repository';
import { DateUtilModule } from '@libs/common/modules/date-util/date-util.module';
import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';

/**
 * 장소 관련 핵심 모듈
 *
 * @publicApi
 */
@Module({
  imports: [DateUtilModule],
  providers: [PlaceCoreService, PlaceCoreRepository, Logger],
  exports: [PlaceCoreService],
})
export class PlaceCoreModule {}
