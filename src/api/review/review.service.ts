import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { GetReviewsByPlaceIdxDto } from './dto/get-reviews-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';
import { CreateReviewByPlaceIdxDto } from './dto/create-review-by-place-idx.dto';
import { PlaceRepository } from '../place/place.repository';
import { KeywordRepository } from '../keyword/keyword.repository';
import { GetReviewsByPlaceIdxResponseDto } from './dto/get-reviews-by-place-idx-response.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    // private readonly placeRepository: PlaceRepository,
    // private readonly keywordRepository: KeywordRepository,
  ) {}

  async getReviewsByPlaceIdx(
    getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto,
  ): Promise<GetReviewsByPlaceIdxResponseDto> {
    const { placeIdx } = getReviewsByPlaceIdxDto;

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

  async createReviewByPlaceIdx(
    createReviewByPlaceIdxDto: CreateReviewByPlaceIdxDto,
  ): Promise<ReviewEntity | null> {
    const { placeIdx, content, reviewImages, keywordIdxList } =
      createReviewByPlaceIdxDto;

    // const validPlace =
    //   await this.placeRepository.selectPlaceByIdx(placeIdx);
    // if (!validPlace) {
    //   return null;
    // }

    // const validKeyword =
    //   await this.keywordRepository.selectKeywordByIdxList(keywordIdxList);

    // if (validKeyword.length !== keywordIdxList.length) {
    //   return null;
    // }

    const { idx: reviewIdx } =
      await this.reviewRepository.createReviewByPlaceIdx(
        placeIdx,
        content,
        1,
        reviewImages,
        keywordIdxList,
      );

    const review =
      await this.reviewRepository.selectReviewByReviewIdx(reviewIdx);

    if (!review) {
      return null;
    }
    return ReviewEntity.createEntityFromPrisma(review);
  }
}
