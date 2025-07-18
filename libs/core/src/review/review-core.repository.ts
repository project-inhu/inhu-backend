import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_REVIEW, SelectReview } from './model/prisma-type/select-review';
import { CreateReviewInput } from './inputs/create-review.input';
import { UpdateReviewInput } from './inputs/update-review.input';

@Injectable()
export class ReviewCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async selectAllReviewByPlaceIdx(placeIdx: number): Promise<SelectReview[]> {
    return await this.txHost.tx.review.findMany({
      ...SELECT_REVIEW,
      where: {
        placeIdx,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async selectReviewByReviewIdx(
    reviewIdx: number,
  ): Promise<SelectReview | null> {
    return await this.txHost.tx.review.findUnique({
      ...SELECT_REVIEW,
      where: {
        idx: reviewIdx,
        deletedAt: null,
      },
    });
  }

  async createReviewByPlaceIdx(
    createReviewInput: CreateReviewInput,
  ): Promise<SelectReview> {
    const { placeIdx, userIdx, content, imagePathList, keywordIdxList } =
      createReviewInput;
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

  async selectAllReviewByUserIdx(userIdx: number): Promise<SelectReview[]> {
    return await this.txHost.tx.review.findMany({
      ...SELECT_REVIEW,
      where: {
        userIdx,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateReviewByReviewIdx(
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

  async deleteReviewByReviewIdx(reviewIdx: number): Promise<void> {
    await this.txHost.tx.review.update({
      where: {
        idx: reviewIdx,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }
}
