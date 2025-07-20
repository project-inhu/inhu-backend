import { Module } from '@nestjs/common';
import { PickedPlaceController } from './picked-place.controller';
import { PickedPlaceService } from './picked-place.service';

@Module({
  imports: [],
  controllers: [PickedPlaceController],
  providers: [PickedPlaceService],
  exports: [PickedPlaceService],
})
export class PickedPlaceModule {}
