import { Module } from '@nestjs/common';
import { PlaceCronSchedule } from './place-cron.schedule';
import { PlaceCronService } from './place-cron.service';

@Module({
  imports: [],
  providers: [PlaceCronSchedule, PlaceCronService],
})
export class PlaceCronModule {}
