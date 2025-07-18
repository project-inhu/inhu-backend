import { Module } from '@nestjs/common';
import { ReviewCoreService } from './review-core.service';
import { ReviewCoreRepository } from './review-core.repository';
import { PlaceCoreRepository } from '@app/core/place/place-core.repository';

@Module({
  providers: [ReviewCoreService, ReviewCoreRepository, PlaceCoreRepository],
  exports: [ReviewCoreService],
})
export class ReviewCoreModule {}
