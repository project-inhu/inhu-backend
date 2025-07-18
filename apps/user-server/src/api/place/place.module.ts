import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepository } from './place.repository';
import { AuthModule } from '@user/auth/auth.module';
import { PlaceCoreModule } from '@app/core';

@Module({
  imports: [AuthModule, PlaceCoreModule],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
