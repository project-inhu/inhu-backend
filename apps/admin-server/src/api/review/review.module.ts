import { ReviewCoreModule } from '@libs/core/review/review-core.module';
import { Module } from '@nestjs/common';
import { ReviewController } from '@user/api/review/review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [ReviewCoreModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
