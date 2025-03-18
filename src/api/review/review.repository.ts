import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { ReviewSelectField } from './type/review-select-field';
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
  async selectReviewListByPlaceIdx(
    placeIdx: number,
  ): Promise<ReviewSelectField[]> {
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
            path: true,
          },
          orderBy: {
            idx: 'asc',
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
   * 특정 idx의 리뷰 조회
   *
   * @author 강정연
   */
  async selectReviewByReviewIdx(
    reviewIdx: number,
  ): Promise<ReviewSelectField | null> {
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
            path: true,
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
    const {
      placeIdx,
      userIdx,
      content,
      imagePathList = [],
      keywordIdxList = [],
    } = createReviewByPlaceIdxInput;
    return await this.prisma.review.create({
      data: {
        placeIdx,
        content,
        userIdx,
        reviewImage:
          imagePathList.length > 0
            ? {
                create: imagePathList.map((path) => ({ path })),
              }
            : undefined,
        reviewKeywordMapping:
          keywordIdxList.length > 0
            ? {
                create: keywordIdxList.map((keywordIdx) => ({
                  keyword: { connect: { idx: keywordIdx } },
                })),
              }
            : undefined,
      },
    });
  }

  /**
   * 특정 사용자 Idx로 작성한 리뷰 리스트 조회
   *
   * @author 강정연
   */
  async selectReviewListByUserIdx(
    userIdx: number,
  ): Promise<ReviewSelectField[]> {
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
            path: true,
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
   * 특정 리뷰 Idx의 리뷰 수정
   *
   * @author 강정연
   */
  async updateReviewByReviewIdx(
    updateReviewByReviewIdxInput: UpdateReviewByReviewIdxInput,
  ): Promise<Review> {
    const { reviewIdx, content, imagePathList, keywordIdxList } =
      updateReviewByReviewIdxInput;
    const updateData: { content?: string } = {};

    if (content) {
      updateData.content = content;
    }

    return await this.prisma.review.update({
      where: { idx: reviewIdx, deletedAt: null },
      data: {
        ...updateData,
        reviewImage:
          imagePathList !== undefined
            ? {
                deleteMany: {},
                create:
                  imagePathList.length > 0
                    ? imagePathList.map((path) => ({ path }))
                    : undefined,
              }
            : undefined,

        reviewKeywordMapping:
          keywordIdxList !== undefined
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

  /**
   * 특정 idx의 리뷰 삭제
   *
   * @author 강정연
   */
  async deleteReviewByReviewIdx(reviewIdx: number): Promise<void> {
    await this.prisma.review.update({
      where: {
        idx: reviewIdx,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }
}
