import { Injectable } from '@nestjs/common';
import { ReviewModel } from './model/review.model';
import { CreateReviewInput } from './inputs/create-review.input';
import { UpdateReviewInput } from './inputs/update-review.input';
import { ReviewCoreRepository } from './review-core.repository';
import { GetReviewOverviewInput } from './inputs/get-review-overview.input';
import { PlaceCoreRepository } from '@app/core/place/place-core.repository';
import { Transactional } from '@nestjs-cls/transactional';
import { ReviewNotFoundException } from '@app/core/review/exception/review-not-found.exception';
import { isEqualArray } from '@app/core/review/util/is-equal-array.util';
import { SelectReview } from '@app/core/review/model/prisma-type/select-review';

@Injectable()
export class ReviewCoreService {
  constructor(
    private readonly reviewCoreRepository: ReviewCoreRepository,
    private readonly placeCoreRepository: PlaceCoreRepository,
  ) {}

  public async getReviewByIdx(idx: number): Promise<ReviewModel | null> {
    const review = await this.reviewCoreRepository.selectReviewByIdx(idx);
    return review && ReviewModel.fromPrisma(review);
  }

  public async getAllReview(
    input: GetReviewOverviewInput,
  ): Promise<ReviewModel[]> {
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
    await this.placeCoreRepository.increasePlaceReviewCountByIdx(placeIdx, 1);
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
      // TODO: place core에서 키워드 목록을 받아서 감소/증가 시키는 로직을 추가해야 함
      await Promise.all(
        review.reviewKeywordMappingList.map(({ keyword }) =>
          this.placeCoreRepository.decreaseKeywordCount(
            keyword.idx,
            keyword.idx,
            1,
          ),
        ),
      );

      await Promise.all(
        input.keywordIdxList.map((keywordIdx) =>
          this.placeCoreRepository.increaseKeywordCount(
            review.place.idx,
            keywordIdx,
            1,
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
   * @throws {ReviewNotFoundException} 404 - 수정하려는 리뷰가 존재하지 않을 때
   */
  public async deleteReviewByIdx(idx: number): Promise<void> {
    const review = await this.reviewCoreRepository.selectReviewByIdx(idx);

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review with idx: ' + idx);
    }

    // TODO: place core에서 키워드 목록을 받아서 감소/증가 시키는 로직을 추가해야 함
    await Promise.all(
      review.reviewKeywordMappingList.map(({ keyword }) =>
        this.placeCoreRepository.decreaseKeywordCount(
          keyword.idx,
          keyword.idx,
          1,
        ),
      ),
    );

    await this.reviewCoreRepository.deleteReviewByIdx(idx);
  }
}
