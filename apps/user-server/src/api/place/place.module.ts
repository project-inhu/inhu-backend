import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { AuthModule } from '@user/auth/auth.module';
import { BookmarkCoreModule, PlaceCoreModule } from '@libs/core';

@Module({
  imports: [AuthModule, PlaceCoreModule, BookmarkCoreModule],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
