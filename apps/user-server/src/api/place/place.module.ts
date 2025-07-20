import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { BookmarkCoreModule, PlaceCoreModule } from '@libs/core';

@Module({
  imports: [PlaceCoreModule, BookmarkCoreModule],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
