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
import { ReviewCountUpdateType } from '../place/common/constants/review-count-update-type.enum';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewRepository: ReviewRepository,
    private readonly placeService: PlaceService,
  ) {}

  /**
   * 특정 장소의 리뷰 목록 조회
   *
   * @author 강정연
   */
  async getAllReviewByPlaceIdx(placeIdx: number): Promise<ReviewEntity[]> {
    await this.placeService.getPlaceByPlaceIdx(placeIdx);

    return (
      await this.reviewRepository.selectAllReviewByPlaceIdx(placeIdx)
    ).map(ReviewEntity.createEntityFromPrisma);
  }

  /**
   * 특정 Idx의 리뷰 조회
   *
   * @author 강정연
   */
  async getReviewByReviewIdx(reviewIdx: number): Promise<ReviewEntity> {
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
  async createReviewByPlaceIdx(
    createReviewInput: CreateReviewInput,
  ): Promise<ReviewEntity> {
    await this.placeService.getPlaceByPlaceIdx(createReviewInput.placeIdx);
    const review = await this.prisma.$transaction(async (tx) => {
      const createdReview = await this.reviewRepository.createReviewByPlaceIdx(
        createReviewInput,
        tx,
      );

      return createdReview;
    });

    return await this.getReviewByReviewIdx(review.idx);
  }

  /**
   * 특정 Idx의 리뷰 수정
   *
   * @author 강정연
   */
  async updateReviewByReviewIdx(
    updateReviewInput: UpdateReviewInput,
  ): Promise<ReviewEntity> {
    const review = await this.getReviewByReviewIdx(updateReviewInput.reviewIdx);

    if (review.userIdx !== updateReviewInput.userIdx) {
      throw new ForbiddenException('You are not allowed to update this review');
    }

    const updatedReview =
      await this.reviewRepository.updateReviewByReviewIdx(updateReviewInput);

    return await this.getReviewByReviewIdx(updatedReview.idx);
  }

  /**
   * 특정 Idx의 리뷰 삭제
   *
   * @author 강정연
   */
  async deleteReviewByReviewIdx(
    reviewIdx: number,
    userIdx: number,
  ): Promise<void> {
    const review = await this.getReviewByReviewIdx(reviewIdx);

    if (review.userIdx != userIdx) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    await this.prisma.$transaction(async (tx) => {
      await this.reviewRepository.deleteReviewByReviewIdx(reviewIdx, tx);
    });
  }

  /**
   * 특정 사용자가 작성한 리뷰 목록 조회
   *
   * @author 강정연
   */
  async getAllReviewByUserIdx(userIdx: number): Promise<ReviewEntity[]> {
    return (await this.reviewRepository.selectAllReviewByUserIdx(userIdx)).map(
      ReviewEntity.createEntityFromPrisma,
    );
  }
}
