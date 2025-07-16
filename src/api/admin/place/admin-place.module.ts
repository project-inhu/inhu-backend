import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AdminPlaceController } from './admin-place.controller';
import { AdminPlaceService } from './admin-place.service';
import { AdminPlaceRepository } from './admin-place.repository';

@Module({
  imports: [AuthModule],
  controllers: [AdminPlaceController],
  providers: [AdminPlaceService, AdminPlaceRepository],
  exports: [AdminPlaceService, AdminPlaceRepository],
})
export class AdminPlaceModule {}
