import { ReviewCoreService } from '@libs/core/review/review-core.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewCoreService: ReviewCoreService) {}

  async deleteReviewByIdx(reviewIdx: number): Promise<void> {
    await this.reviewCoreService.deleteReviewByIdx(reviewIdx);
  }
}
