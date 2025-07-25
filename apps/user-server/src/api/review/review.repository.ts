import { Injectable } from '@nestjs/common';
import { PrismaService } from '@user/common/module/prisma/prisma.service';
import { ReviewSelectField } from './type/review-select-field';
import { Prisma, Review } from '@prisma/client';
import { CreateReviewInput } from './input/create-review.input';
import { UpdateReviewInput } from './input/update-review.input';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 특정 장소에 대한 리뷰 목록 조회
   *
   * @author 강정연
   */
  async selectAllReviewByPlaceIdx(
    placeIdx: number,
  ): Promise<ReviewSelectField[]> {
    return await this.prisma.review.findMany({
      where: {
        placeIdx,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        idx: true,
        userIdx: true,
        placeIdx: true,
        content: true,
        createdAt: true,
        reviewImageList: {
          select: {
            path: true,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        reviewKeywordMappingList: {
          select: {
            keyword: {
              select: {
                idx: true,
                content: true,
              },
            },
          },
          orderBy: {
            keyword: {
              idx: 'asc',
            },
          },
        },
        user: {
          select: {
            nickname: true,
            profileImagePath: true,
          },
        },
        place: {
          select: {
            idx: true,
            name: true,
            roadAddress: {
              select: {
                addressName: true,
                detailAddress: true,
              },
            },
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
        reviewImageList: {
          select: {
            path: true,
          },
        },
        reviewKeywordMappingList: {
          select: {
            keyword: {
              select: {
                idx: true,
                content: true,
              },
            },
          },
          orderBy: {
            keyword: {
              idx: 'asc',
            },
          },
        },
        user: {
          select: {
            nickname: true,
            profileImagePath: true,
          },
        },
        place: {
          select: {
            idx: true,
            name: true,
            roadAddress: {
              select: {
                addressName: true,
                detailAddress: true,
              },
            },
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
    createReviewInput: CreateReviewInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Review> {
    const db = tx ?? this.prisma;
    const {
      placeIdx,
      userIdx,
      content,
      imagePathList = [],
      keywordIdxList = [],
    } = createReviewInput;
    return await db.review.create({
      data: {
        placeIdx,
        content,
        userIdx,
        reviewImageList:
          imagePathList.length > 0
            ? {
                create: imagePathList.map((path) => ({ path })),
              }
            : undefined,
        reviewKeywordMappingList:
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
  async selectAllReviewByUserIdx(
    userIdx: number,
  ): Promise<ReviewSelectField[]> {
    return await this.prisma.review.findMany({
      where: {
        userIdx,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        idx: true,
        userIdx: true,
        placeIdx: true,
        content: true,
        createdAt: true,
        reviewImageList: {
          select: {
            path: true,
          },
        },
        reviewKeywordMappingList: {
          select: {
            keyword: {
              select: {
                idx: true,
                content: true,
              },
            },
          },
        },
        user: {
          select: {
            nickname: true,
            profileImagePath: true,
          },
        },
        place: {
          select: {
            idx: true,
            name: true,
            roadAddress: {
              select: {
                addressName: true,
                detailAddress: true,
              },
            },
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
    updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    const { reviewIdx, content, imagePathList, keywordIdxList } =
      updateReviewInput;
    const updateData: { content?: string } = {};

    if (content) {
      updateData.content = content;
    }

    return await this.prisma.review.update({
      where: { idx: reviewIdx, deletedAt: null },
      data: {
        ...updateData,
        reviewImageList:
          imagePathList !== undefined
            ? {
                deleteMany: {},
                create:
                  imagePathList.length > 0
                    ? imagePathList.map((path) => ({ path }))
                    : undefined,
              }
            : undefined,

        reviewKeywordMappingList:
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
  async deleteReviewByReviewIdx(
    reviewIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const db = tx ?? this.prisma;
    await db.review.update({
      where: {
        idx: reviewIdx,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * 특정 장소의 리뷰 개수 조회
   *
   * @author 강정연
   */
  async selectReviewCountByPlaceIdx(placeIdx: number): Promise<number> {
    return this.prisma.review.count({
      where: {
        placeIdx,
        deletedAt: null,
      },
    });
  }
}
