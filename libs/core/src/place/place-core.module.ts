import { Module } from '@nestjs/common';
import { PlaceCoreService } from './place-core.service';
import { PlaceCoreRepository } from './place-core.repository';
import { DateUtilModule } from '@libs/common';

@Module({
  imports: [DateUtilModule],
  providers: [PlaceCoreService, PlaceCoreRepository],
  exports: [PlaceCoreService],
})
export class PlaceCoreModule {}
