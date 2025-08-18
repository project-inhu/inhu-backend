import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewCoreModule } from '@libs/core/review/review-core.module';
import { ReviewAuthService } from '@user/api/review/review-auth.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';

@Module({
  imports: [ReviewCoreModule, PlaceCoreModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewAuthService],
  exports: [ReviewService],
})
export class ReviewModule {}
