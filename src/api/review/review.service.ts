import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { GetReviewsByPlaceIdxDto } from './dto/get-reviews-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';
import { CreateReviewByPlaceIdxDto } from './dto/create-review-by-place-idx.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async getReviewsByPlaceIdx(
    getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto,
  ): Promise<ReviewEntity[]> {
    const { placeIdx } = getReviewsByPlaceIdxDto;
    return (await this.reviewRepository.selectReviewsByPlaceIdx(placeIdx)).map(
      ReviewEntity.createEntityFromPrisma,
    );
  }

  async createReviewByPlaceIdx(
    createReviewByPlaceIdxDto: CreateReviewByPlaceIdxDto,
  ) {
    const { placeIdx, content, keywordIdx } = createReviewByPlaceIdxDto;

    const review = await this.reviewRepository.createReviewByPlaceIdx(
      placeIdx,
      content,
      1,
    );
  }
}
