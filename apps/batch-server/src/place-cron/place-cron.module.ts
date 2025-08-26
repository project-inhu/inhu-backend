import { Logger, Module } from '@nestjs/common';
import { PlaceCronSchedule } from './place-cron.schedule';
import { PlaceCronService } from './place-cron.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { DateUtilModule } from '@libs/common/modules/date-util/date-util.module';
import { PlaceCronController } from './place-cron.controller';

@Module({
  imports: [PlaceCoreModule, DateUtilModule],
  controllers: [PlaceCronController],
  providers: [PlaceCronSchedule, PlaceCronService, Logger],
})
export class PlaceCronModule {}
