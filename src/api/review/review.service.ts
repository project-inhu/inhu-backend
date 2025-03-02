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
  ): Promise<ReviewEntity | null> {
    const { placeIdx, content, reviewImages, keywordIdxList } =
      createReviewByPlaceIdxDto;

    // const validKeywords = await this.reviewRepository.selectKeywordsByIdxList(keywordIdxList);
    // const validKeywordIdxList = validKeywords.map((keyword)=>keyword.idx);

    // const invalidKeywordIdxList = keywordIdxList.filter((idx)=>!validKeywordIdxList.includes(idx));

    // if(invalidKeywordIdxList.length >0){
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

    const review = await this.reviewRepository.selectReviewByIdx(reviewIdx);
    if (!review) {
      return null;
    }
    return ReviewEntity.createEntityFromPrisma(review);
  }
}
