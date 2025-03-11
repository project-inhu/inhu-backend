import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { ReviewQueryResult } from './interfaces/review-query-result.interface';
import { Review } from '@prisma/client';
import { CreateReviewByPlaceIdxInput } from './input/create-review-by-place-idx.input';
import { UpdateReviewByReviewIdxInput } from './input/update-review-by-review-idx.input';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 특정 장소에 대한 리뷰 목록 조회
   *
   * @author 강정연
   */
  async selectReviewsByPlaceIdx(
    placeIdx: number,
  ): Promise<ReviewQueryResult[]> {
    return await this.prisma.review.findMany({
      where: {
        placeIdx,
        deletedAt: null,
      },
      select: {
        idx: true,
        userIdx: true,
        placeIdx: true,
        content: true,
        createdAt: true,
        reviewImage: {
          select: {
            imagePath: true,
          },
        },
        reviewKeywordMapping: {
          select: {
            keyword: {
              select: { content: true },
            },
          },
        },
        user: {
          select: {
            nickname: true,
          },
        },
        place: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  /**
   * 특정 리뷰 Idx로 리뷰 조회
   *
   * @author 강정연
   */
  async selectReviewByReviewIdx(
    reviewIdx: number,
  ): Promise<ReviewQueryResult | null> {
    return await this.prisma.review.findUnique({
      where: {
        idx: reviewIdx,
        deletedAt: null,
      },
      select: {
        idx: true,
        userIdx: true,
        placeIdx: true,
        content: true,
        createdAt: true,
        reviewImage: {
          select: {
            imagePath: true,
          },
        },
        reviewKeywordMapping: {
          select: {
            keyword: {
              select: { content: true },
            },
          },
        },
        user: {
          select: {
            nickname: true,
          },
        },
        place: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  /**
   * 특정 장소에 리뷰 생성
   *
   * @author 강정연
   */
  async createReviewByPlaceIdx(
    createReviewByPlaceIdxInput: CreateReviewByPlaceIdxInput,
  ): Promise<Review> {
    return await this.prisma.review.create({
      data: {
        placeIdx: createReviewByPlaceIdxInput.placeIdx,
        content: createReviewByPlaceIdxInput.content,
        userIdx: 1,
        reviewImage: {
          create: (createReviewByPlaceIdxInput.reviewImages ?? []).map(
            (imagePath) => ({ imagePath }),
          ),
        },
        reviewKeywordMapping: {
          create: (createReviewByPlaceIdxInput.keywordIdxList ?? []).map(
            (keywordIdx) => ({
              keyword: { connect: { idx: keywordIdx } },
            }),
          ),
        },
      },
    });
  }

  /**
   * 특정 사용자 Idx로 작성한 리뷰 리스트 조회
   *
   * @author 강정연
   */
  async selectReviewsByUserIdx(userIdx: number): Promise<ReviewQueryResult[]> {
    return await this.prisma.review.findMany({
      where: {
        userIdx,
        deletedAt: null,
      },
      select: {
        idx: true,
        userIdx: true,
        placeIdx: true,
        content: true,
        createdAt: true,
        reviewImage: {
          select: {
            imagePath: true,
          },
        },
        reviewKeywordMapping: {
          select: {
            keyword: {
              select: { content: true },
            },
          },
        },
        user: {
          select: {
            nickname: true,
          },
        },
        place: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async updateReviewByReviewIdx(
    updateReviewByReviewIdxInput: UpdateReviewByReviewIdxInput,
  ) {
    const { reviewIdx, content, reviewImages, keywordIdxList } =
      updateReviewByReviewIdxInput;
    const updateData: { content?: string } = {};

    if (content) {
      updateData.content = content;
    }

    return await this.prisma.review.update({
      where: { idx: reviewIdx, deletedAt: null },
      data: {
        ...updateData,
        reviewImage: reviewImages
          ? {
              deleteMany: {},
              create:
                reviewImages.length > 0
                  ? reviewImages.map((imagePath) => ({ imagePath }))
                  : undefined,
            }
          : undefined,

        reviewKeywordMapping: keywordIdxList
          ? {
              deleteMany: {},
              create:
                keywordIdxList.length > 0
                  ? keywordIdxList.map((keywordIdx) => ({
                      keyword: { connect: { idx: keywordIdx } },
                    }))
                  : undefined,
            }
          : undefined,
      },
    });
  }
}
