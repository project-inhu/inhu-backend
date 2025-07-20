import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewCoreModule } from '@libs/core/review/review-core.module';
import { PlaceCoreModule } from '@libs/core';

@Module({
  imports: [ReviewCoreModule, PlaceCoreModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
