import { Module } from '@nestjs/common';
import { PickedPlaceController } from './picked-place.controller';
import { PickedPlaceService } from './picked-place.service';
import { BookmarkCoreModule } from '@libs/core/bookmark/bookmark-core.module';
import { PickedPlaceCoreModule } from '@libs/core/picked-place/picked-place-core.module';

@Module({
  imports: [PickedPlaceCoreModule, BookmarkCoreModule],
  controllers: [PickedPlaceController],
  providers: [PickedPlaceService],
  exports: [PickedPlaceService],
})
export class PickedPlaceModule {}
