import { Module } from '@nestjs/common';
import { ReviewCoreService } from './review-core.service';
import { RevieCoreRepository } from './review-core.repository';

@Module({
  providers: [ReviewCoreService, RevieCoreRepository],
  exports: [ReviewCoreService],
})
export class ReviewCoreModule {}
