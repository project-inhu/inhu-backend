import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { ReviewEntity } from './entity/review.entity';
import { CreateReviewInput } from './input/create-review.input';
import { UpdateReviewInput } from './input/update-review.input';
import { PlaceService } from '../place/place.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
  ) {}

  /**
   * 특정 장소의 리뷰 목록 조회
   *
   * @author 강정연
   */
  async getAllReviewByPlaceIdx(placeIdx: number): Promise<ReviewEntity[]> {
    await this.placeService.getPlace(placeIdx);

    return (
      await this.reviewRepository.selectAllReviewByPlaceIdx(placeIdx)
    ).map(ReviewEntity.createEntityFromPrisma);
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
    createReviewInput: CreateReviewInput,
  ): Promise<ReviewEntity> {
    await this.placeService.getPlace(createReviewInput.placeIdx);
    const review =
      await this.reviewRepository.createReviewByPlaceIdx(createReviewInput);

    return await this.getReview(review.idx);
  }

  /**
   * 특정 Idx의 리뷰 수정
   *
   * @author 강정연
   */
  async updateReview(
    updateReviewInput: UpdateReviewInput,
  ): Promise<ReviewEntity> {
    const review = await this.getReview(updateReviewInput.reviewIdx);

    if (review.userIdx !== updateReviewInput.userIdx) {
      throw new ForbiddenException('You are not allowed to update this review');
    }

    const updatedReview =
      await this.reviewRepository.updateReviewByReviewIdx(updateReviewInput);

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

  /**
   * 특정 사용자가 작성한 리뷰 목록 조회
   *
   * @author 강정연
   */
  async getAllReviewByUserIdx(userIdx: number): Promise<ReviewEntity[]> {
    await this.userService.getUser(userIdx);

    return (await this.reviewRepository.selectAllReviewByUserIdx(userIdx)).map(
      ReviewEntity.createEntityFromPrisma,
    );
  }
}
