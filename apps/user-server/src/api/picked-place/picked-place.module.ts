import { Module } from '@nestjs/common';
import { PickedPlaceController } from './picked-place.controller';
import { PickedPlaceService } from './picked-place.service';
import { BookmarkCoreModule, PickedPlaceCoreModule } from '@libs/core';

@Module({
  imports: [PickedPlaceCoreModule, BookmarkCoreModule],
  controllers: [PickedPlaceController],
  providers: [PickedPlaceService],
  exports: [PickedPlaceService],
})
export class PickedPlaceModule {}
