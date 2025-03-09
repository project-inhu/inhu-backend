import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { ReviewEntity } from './entity/review.entity';
import { CreateReviewByPlaceIdxDto } from './dto/create-review-by-place-idx.dto';
import { PlaceRepository } from '../place/place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { GetReviewsByPlaceIdxResponseDto } from './dto/get-reviews-by-place-idx-response.dto';
import { CreateReviewByPlaceIdxResponseDto } from './dto/create-review-by-place-idx-response.dto';
import { GetReviewByReviewIdxResponseDto } from './dto/get-review-by-review-idx-response.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    // private readonly placeRepository: PlaceRepository,
    // private readonly keywordRepository: KeywordRepository,
  ) {}

  /**
   * 특정 장소의 리뷰 목록 조회
   *
   * @author 강정연
   */
  async getReviewsByPlaceIdx(
    placeIdx: number,
  ): Promise<GetReviewsByPlaceIdxResponseDto> {
    // const validPlace =
    //   await this.placeRepository.selectPlaceByIdx(placeIdx);
    // if (!validPlace) {
    //   return null;
    // }

    const reviews = (
      await this.reviewRepository.selectReviewsByPlaceIdx(placeIdx)
    ).map(ReviewEntity.createEntityFromPrisma);

    return { reviews };
  }

  /**
   * 특정 리뷰 Idx로 리뷰 조회
   *
   * @author 강정연
   */
  async getReviewByReviewIdx(
    reviewIdx: number,
  ): Promise<GetReviewByReviewIdxResponseDto> {
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
    createReviewByPlaceIdxDto: CreateReviewByPlaceIdxDto,
  ): Promise<CreateReviewByPlaceIdxResponseDto> {
    const {
      placeIdx,
      content,
      reviewImages = [],
      keywordIdxList = [],
    } = createReviewByPlaceIdxDto;

    // await this.placeService.existsPlace(placeIdx);
    // await this.keywordService.existKeyword(keywordIdxList);

    const reviewIdx = await this.reviewRepository.createReviewByPlaceIdx(
      placeIdx,
      content,
      1,
      reviewImages,
      keywordIdxList,
    );

    const review = await this.getReviewByReviewIdx(reviewIdx);

    return review;
  }
}
