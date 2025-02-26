import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { GetReviewsByPlaceIdxDto } from './dto/get-reviews-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async getReviewsByPlaceIdx(getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto) {
    const { placeIdx } = getReviewsByPlaceIdxDto; // DTO에서 placeIdx 추출
    return (await this.reviewRepository.selectReviewsByPlaceIdx(placeIdx)).map(
      ReviewEntity.createEntityFromPrisma,
    );
  }
}
