import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_REVIEW, SelectReview } from './model/prisma-type/select-review';
import { CreateReviewInput } from './inputs/create-review.input';
import { UpdateReviewInput } from './inputs/update-review.input';
import { GetAllReviewInput } from './inputs/get-all-review.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async selectAllReview({
    placeIdx,
    userIdx,
    order,
    orderBy,
    take,
    skip,
  }: GetAllReviewInput): Promise<SelectReview[]> {
    return await this.txHost.tx.review.findMany({
      ...SELECT_REVIEW,
      where: {
        AND: [
          { deletedAt: null },
          this.getPlaceFilter(placeIdx),
          this.getUserFilter(userIdx),
        ],
      },
      orderBy: this.getOrderByClause({ order, orderBy }),
      take,
      skip,
    });
  }

  async selectReviewByIdx(reviewIdx: number): Promise<SelectReview | null> {
    return await this.txHost.tx.review.findUnique({
      ...SELECT_REVIEW,
      where: {
        idx: reviewIdx,
        deletedAt: null,
      },
    });
  }

  /**
   * @param placeIdx 장소 식별자
   * @param userIdx 작성자 식별자
   * @param input
   * @returns
   */
  async createReviewByPlaceIdx(
    placeIdx: number,
    userIdx: number,
    { content, imagePathList, keywordIdxList }: CreateReviewInput,
  ): Promise<SelectReview> {
    return await this.txHost.tx.review.create({
      ...SELECT_REVIEW,
      data: {
        placeIdx,
        content,
        userIdx,
        reviewImageList:
          imagePathList.length > 0
            ? {
                create: imagePathList.map((path: string) => ({ path })),
              }
            : undefined,
        reviewKeywordMappingList:
          keywordIdxList.length > 0
            ? {
                create: keywordIdxList.map((keywordIdx: number) => ({
                  keyword: { connect: { idx: keywordIdx } },
                })),
              }
            : undefined,
      },
    });
  }

  async updateReviewByIdx(
    reviewIdx: number,
    updateReviewInput: UpdateReviewInput,
  ): Promise<void> {
    const { content, imagePathList, keywordIdxList } = updateReviewInput;

    await this.txHost.tx.review.update({
      where: { idx: reviewIdx, deletedAt: null },
      data: {
        content,
        reviewImageList:
          imagePathList !== undefined
            ? {
                deleteMany: {},
                create:
                  imagePathList.length > 0
                    ? imagePathList.map((path: string) => ({ path }))
                    : undefined,
              }
            : undefined,

        reviewKeywordMappingList:
          keywordIdxList !== undefined
            ? {
                deleteMany: {},
                create:
                  keywordIdxList.length > 0
                    ? keywordIdxList.map((keywordIdx: number) => ({
                        keyword: { connect: { idx: keywordIdx } },
                      }))
                    : undefined,
              }
            : undefined,
      },
    });
  }

  async deleteReviewByIdx(reviewIdx: number): Promise<void> {
    await this.txHost.tx.review.update({
      where: {
        idx: reviewIdx,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  private getPlaceFilter(placeIdx?: number): Prisma.ReviewWhereInput {
    if (!placeIdx) return {};
    return { placeIdx };
  }

  private getUserFilter(userIdx?: number): Prisma.ReviewWhereInput {
    if (!userIdx) return {};
    return { userIdx };
  }

  private getOrderByClause({
    order = 'desc',
    orderBy = 'time',
  }: Pick<
    GetAllReviewInput,
    'order' | 'orderBy'
  >): Prisma.ReviewOrderByWithRelationInput {
    return { createdAt: order };
  }
}
