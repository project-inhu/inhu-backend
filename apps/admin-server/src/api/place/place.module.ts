import { PlaceController } from '@admin/api/place/place.controller';
import { PlaceService } from '@admin/api/place/place.service';
import { PlaceCoreModule } from '@libs/core';
import { Module } from '@nestjs/common';

@Module({
  imports: [PlaceCoreModule],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [],
})
export class PlaceModule {}
