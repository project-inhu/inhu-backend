import { Injectable } from '@nestjs/common';
import { RevieCoreRepository } from './review-core.repository';

@Injectable()
export class ReviewCoreService {
  constructor(private readonly reviewCoreRepository: RevieCoreRepository) {}

  public async getReviewByReviewIdx(idx: number) {
    const review = await this.reviewCoreRepository.selectReviewByReviewIdx(idx);
    return review && ReviewModel.fromPrisma(review);
  }
}
