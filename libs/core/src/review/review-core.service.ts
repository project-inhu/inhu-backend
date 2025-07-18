import { Injectable } from '@nestjs/common';
import { ReviewModel } from './model/review.model';
import { CreateReviewInput } from './inputs/create-review.input';
import { UpdateReviewInput } from './inputs/update-review.input';
import { ReviewCoreRepository } from './review-core.repository';
import { GetReviewOverviewInput } from './inputs/get-review-overview.input';

@Injectable()
export class ReviewCoreService {
  constructor(private readonly reviewCoreRepository: ReviewCoreRepository) {}

  public async getReviewByIdx(idx: number): Promise<ReviewModel | null> {
    const review = await this.reviewCoreRepository.selectReviewByReviewIdx(idx);
    return review && ReviewModel.fromPrisma(review);
  }

  public async getAllReview(
    input: GetReviewOverviewInput,
  ): Promise<ReviewModel[]> {
    return (await this.reviewCoreRepository.selectAllReview(input)).map(
      ReviewModel.fromPrisma,
    );
  }

  public async createReviewByPlaceIdx(
    placeIdx: number,
    userIdx: number,
    input: CreateReviewInput,
  ): Promise<ReviewModel> {
    return ReviewModel.fromPrisma(
      await this.reviewCoreRepository.createReviewByPlaceIdx(
        placeIdx,
        userIdx,
        input,
      ),
    );
  }

  public async updateReviewByIdx(
    idx: number,
    input: UpdateReviewInput,
  ): Promise<void> {
    await this.reviewCoreRepository.updateReviewByReviewIdx(idx, input);
  }

  public async deleteReviewByIdx(idx: number): Promise<void> {
    await this.reviewCoreRepository.deleteReviewByReviewIdx(idx);
  }
}
