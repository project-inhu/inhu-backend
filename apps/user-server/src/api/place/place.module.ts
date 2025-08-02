import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { BookmarkCoreModule } from '@libs/core/bookmark/bookmark-core.module';

@Module({
  imports: [PlaceCoreModule, BookmarkCoreModule],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
