import { Injectable } from '@nestjs/common';
import { ReviewModel } from './model/review.model';
import { CreateReviewInput } from './inputs/create-review.input';
import { UpdateReviewInput } from './inputs/update-review.input';
import { ReviewCoreRepository } from './review-core.repository';
import { GetReviewOverviewInput } from './inputs/get-review-overview.input';
import { Transactional } from '@nestjs-cls/transactional';
import { PlaceCoreService } from '../place/place-core.service';
import { ReviewNotFoundException } from '@libs/core/review/exception/review-not-found.exception';
import { SelectReview } from '@libs/core/review/model/prisma-type/select-review';
import { isEqualArray } from '@libs/core/review/util/is-equal-array.util';

@Injectable()
export class ReviewCoreService {
  constructor(
    private readonly reviewCoreRepository: ReviewCoreRepository,
    private readonly placeCoreService: PlaceCoreService,
  ) {}

  public async getReviewByIdx(idx: number): Promise<ReviewModel | null> {
    const review = await this.reviewCoreRepository.selectReviewByIdx(idx);
    return review && ReviewModel.fromPrisma(review);
  }

  public async getAllReview(input: GetReviewInput): Promise<ReviewModel[]> {
    return (await this.reviewCoreRepository.selectAllReview(input)).map(
      ReviewModel.fromPrisma,
    );
  }

  @Transactional()
  public async createReviewByPlaceIdx(
    placeIdx: number,
    userIdx: number,
    input: CreateReviewInput,
  ): Promise<ReviewModel> {
    await this.placeCoreService.increasePlaceReviewCount(placeIdx);

    await Promise.all(
      input.keywordIdxList.map((keywordIdx) =>
        this.placeCoreService.increaseKeywordCount(placeIdx, keywordIdx),
      ),
    );

    return ReviewModel.fromPrisma(
      await this.reviewCoreRepository.createReviewByPlaceIdx(
        placeIdx,
        userIdx,
        input,
      ),
    );
  }

  /**
   * @throws {ReviewNotFoundException} 404 - 수정하려는 리뷰가 존재하지 않을 때
   */
  public async updateReviewByIdx(
    idx: number,
    input: UpdateReviewInput,
  ): Promise<void> {
    const review = await this.reviewCoreRepository.selectReviewByIdx(idx);

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review with idx: ' + idx);
    }

    if (
      input.keywordIdxList !== undefined &&
      this.isChangedReviewKeyword(input, review)
    ) {
      await Promise.all(
        review.reviewKeywordMappingList.map(({ keyword }) =>
          this.placeCoreService.decreaseKeywordCount(keyword.idx, keyword.idx),
        ),
      );

      await Promise.all(
        input.keywordIdxList.map((keywordIdx) =>
          this.placeCoreService.increaseKeywordCount(
            review.place.idx,
            keywordIdx,
          ),
        ),
      );
    }

    await this.reviewCoreRepository.updateReviewByIdx(idx, input);
  }

  private isChangedReviewKeyword(
    input: UpdateReviewInput,
    review: SelectReview,
  ) {
    return (
      input.keywordIdxList &&
      isEqualArray(
        input.keywordIdxList.sort(),
        review.reviewKeywordMappingList
          .map(({ keyword: { idx } }) => idx)
          .sort(),
      )
    );
  }

  /**
   * @throws {ReviewNotFoundException} 404 - 삭제하려는 리뷰가 존재하지 않을 때
   */
  public async deleteReviewByIdx(idx: number): Promise<void> {
    const review = await this.reviewCoreRepository.selectReviewByIdx(idx);

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review with idx: ' + idx);
    }

    await this.placeCoreService.decreasePlaceReviewCount(review.place.idx);

    await Promise.all(
      review.reviewKeywordMappingList.map(({ keyword }) =>
        this.placeCoreService.decreaseKeywordCount(keyword.idx, keyword.idx),
      ),
    );

    await this.reviewCoreRepository.deleteReviewByIdx(idx);
  }
}
