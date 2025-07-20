import { Module } from '@nestjs/common';
import { ReviewCoreService } from './review-core.service';
import { ReviewCoreRepository } from './review-core.repository';
import { PlaceCoreModule } from '../place/place-core.module';

@Module({
  imports: [PlaceCoreModule],
  providers: [ReviewCoreService, ReviewCoreRepository],
  exports: [ReviewCoreService],
})
export class ReviewCoreModule {}
