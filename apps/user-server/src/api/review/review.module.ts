import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PlaceModule } from '../place/place.module';
import { KeywordModule } from '../keyword/keyword.module';
import { UserModule } from '../user/user.module';
import { ReviewCoreModule } from '@libs/core/review/review-core.module';

@Module({
  imports: [ReviewCoreModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
