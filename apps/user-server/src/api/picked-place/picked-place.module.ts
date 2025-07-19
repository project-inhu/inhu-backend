import { Module } from '@nestjs/common';
import { AuthModule } from '@user/auth/auth.module';
import { PickedPlaceController } from './picked-place.controller';
import { PickedPlaceService } from './picked-place.service';

@Module({
  imports: [AuthModule],
  controllers: [PickedPlaceController],
  providers: [PickedPlaceService],
  exports: [PickedPlaceService],
})
export class PickedPlaceModule {}
