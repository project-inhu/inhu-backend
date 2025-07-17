import { Module } from '@nestjs/common';
import { AuthModule } from '@user/auth/auth.module';
import { PickedPlaceController } from './picked-place.controller';
import { PickedPlaceService } from './picked-place.service';
import { PickedPlaceRepository } from './picked-place.repository';

@Module({
  imports: [AuthModule],
  controllers: [PickedPlaceController],
  providers: [PickedPlaceService, PickedPlaceRepository],
  exports: [PickedPlaceService, PickedPlaceRepository],
})
export class PickedPlaceModule {}
