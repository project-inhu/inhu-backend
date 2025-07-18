import { Module } from '@nestjs/common';
import { ReviewCoreService } from './review-core.service';
import { ReviewCoreRepository } from './review-core.repository';

@Module({
  providers: [ReviewCoreService, ReviewCoreRepository],
  exports: [ReviewCoreService],
})
export class ReviewCoreModule {}
