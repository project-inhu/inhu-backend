import { ReviewCoreService } from '@libs/core/review/review-core.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewCoreService: ReviewCoreService) {}

  public async getAllReview() {}
}
