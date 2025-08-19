import { Logger, Module } from '@nestjs/common';
import { PlaceCronSchedule } from './place-cron.schedule';
import { PlaceCronService } from './place-cron.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { DateUtilModule } from '@libs/common/modules/date-util/date-util.module';

@Module({
  imports: [PlaceCoreModule, DateUtilModule],
  providers: [PlaceCronSchedule, PlaceCronService, Logger],
})
export class PlaceCronModule {}
