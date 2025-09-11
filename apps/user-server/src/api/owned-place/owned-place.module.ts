import { Module } from '@nestjs/common';
import { OwnedPlaceController } from './owned-place.controller';
import { OwnedPlaceCoreModule } from '@libs/core/owned-place/owned-place-core.module';
import { OwnedPlaceService } from './owned-place.service';

@Module({
  imports: [OwnedPlaceCoreModule],
  controllers: [OwnedPlaceController],
  providers: [OwnedPlaceService],
  exports: [OwnedPlaceService],
})
export class OwnedPlaceModule {}
