import { Module } from '@nestjs/common';
import { ReviewCoreService } from './review-core.service';
import { ReviewCoreRepository } from './review-core.repository';
import { PlaceCoreModule } from '../place/place-core.module';

/**
 * 리뷰 코어 모듈
 *
 * @publicApi
 */
@Module({
  imports: [PlaceCoreModule],
  providers: [ReviewCoreService, ReviewCoreRepository],
  exports: [ReviewCoreService],
})
export class ReviewCoreModule {}
