import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { ReviewEntity } from './entity/review.entity';
import { PlaceRepository } from '../place/place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { CreateReviewByPlaceIdxInput } from './input/create-review-by-place-idx.input';
import { UpdateReviewByReviewIdxInput } from './input/update-review-by-review-idx.input';
import { PlaceService } from '../place/place.service';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    // private readonly placeService: PlaceService,
    // private readonly keywordRepository: KeywordRepository,
  ) {}

  /**
   * 특정 장소의 리뷰 목록 조회
   *
   * @author 강정연
   */
  async getReviewsByPlaceIdx(placeIdx: number): Promise<ReviewEntity[]> {
    // const validPlace =
    //   await this.placeRepository.selectPlaceByIdx(placeIdx);
    // if (!validPlace) {
    //   return null;
    // }

    const reviews = (
      await this.reviewRepository.selectReviewsByPlaceIdx(placeIdx)
    ).map(ReviewEntity.createEntityFromPrisma);

    return reviews;
  }

  /**
   * 특정 리뷰 Idx로 리뷰 조회
   *
   * @author 강정연
   */
  async getReviewByReviewIdx(reviewIdx: number): Promise<ReviewEntity> {
    const review =
      await this.reviewRepository.selectReviewByReviewIdx(reviewIdx);
    if (!review) {
      throw new NotFoundException('review not found');
    }

    return ReviewEntity.createEntityFromPrisma(review);
  }

  /**
   * 특정 장소에 리뷰 생성
   *
   * @author 강정연
   */
  async createReviewByPlaceIdx(
    createReviewByPlaceIdxInput: CreateReviewByPlaceIdxInput,
  ): Promise<ReviewEntity> {
    // await this.placeService.getPlaceByPlaceIdx(
    //   createReviewByPlaceIdxInput.placeIdx,
    // );
    // await this.keywordService.existKeyword(keywordIdxList);

    const review = await this.reviewRepository.createReviewByPlaceIdx(
      createReviewByPlaceIdxInput,
    );

    return await this.getReviewByReviewIdx(review.idx);
  }

  async updateReviewByReviewIdx(
    updateReviewByReviewIdxInput: UpdateReviewByReviewIdxInput,
  ): Promise<ReviewEntity> {
    const review = await this.getReviewByReviewIdx(
      updateReviewByReviewIdxInput.reviewIdx,
    );

    if (review.userIdx !== updateReviewByReviewIdxInput.userIdx) {
      throw new ForbiddenException('You are not allowed to update this review');
    }

    const updatedReview = await this.reviewRepository.updateReviewByReviewIdx(
      updateReviewByReviewIdxInput,
    );

    return await this.getReviewByReviewIdx(updatedReview.idx);
  }
}
