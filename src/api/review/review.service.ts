import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { ReviewEntity } from './entity/review.entity';
import { CreateReviewByPlaceIdxInput } from './input/create-review-by-place-idx.input';
import { UpdateReviewByReviewIdxInput } from './input/update-review-by-review-idx.input';
import { PlaceService } from '../place/place.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly placeService: PlaceService,
  ) {}

  /**
   * 특정 장소의 리뷰 목록 조회
   *
   * @author 강정연
   */
  async getReviewList(placeIdx: number): Promise<ReviewEntity[]> {
    await this.placeService.getPlace(placeIdx);

    const reviewList = (
      await this.reviewRepository.selectReviewListByPlaceIdx(placeIdx)
    ).map(ReviewEntity.createEntityFromPrisma);

    return reviewList;
  }

  /**
   * 특정 Idx의 리뷰 조회
   *
   * @author 강정연
   */
  async getReview(reviewIdx: number): Promise<ReviewEntity> {
    const review =
      await this.reviewRepository.selectReviewByReviewIdx(reviewIdx);
    if (!review) {
      throw new NotFoundException('Review does not exist');
    }

    return ReviewEntity.createEntityFromPrisma(review);
  }

  /**
   * 특정 장소에 리뷰 생성
   *
   * @author 강정연
   */
  async createReview(
    createReviewByPlaceIdxInput: CreateReviewByPlaceIdxInput,
  ): Promise<ReviewEntity> {
    await this.placeService.getPlace(createReviewByPlaceIdxInput.placeIdx);
    const review = await this.reviewRepository.createReviewByPlaceIdx(
      createReviewByPlaceIdxInput,
    );

    return await this.getReview(review.idx);
  }

  /**
   * 특정 Idx의 리뷰 수정
   *
   * @author 강정연
   */
  async updateReview(
    updateReviewByReviewIdxInput: UpdateReviewByReviewIdxInput,
  ): Promise<ReviewEntity> {
    const review = await this.getReview(updateReviewByReviewIdxInput.reviewIdx);

    if (review.userIdx !== updateReviewByReviewIdxInput.userIdx) {
      throw new ForbiddenException('You are not allowed to update this review');
    }

    const updatedReview = await this.reviewRepository.updateReviewByReviewIdx(
      updateReviewByReviewIdxInput,
    );

    return await this.getReview(updatedReview.idx);
  }

  /**
   * 특정 Idx의 리뷰 삭제
   *
   * @author 강정연
   */
  async deleteReview(reviewIdx: number, userIdx: number): Promise<void> {
    const review = await this.getReview(reviewIdx);

    if (review.userIdx != userIdx) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    await this.reviewRepository.deleteReviewByReviewIdx(reviewIdx);
  }
}
