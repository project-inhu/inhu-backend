import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SelectReview } from './model/prisma-type/select-review';
import { CreateReviewInput } from './inputs/create-review.input';
import { UpdateReviewInput } from './inputs/update-review.input';

@Injectable()
export class ReviewCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async selectAllReviewByPlaceIdx(placeIdx: number): Promise<SelectReview[]> {
    return await this.txHost.tx.review.findMany({
      where: {
        placeIdx,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        idx: true,
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
            idx: true,
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

  async selectReviewByReviewIdx(
    reviewIdx: number,
  ): Promise<SelectReview | null> {
    return await this.txHost.tx.review.findUnique({
      where: {
        idx: reviewIdx,
        deletedAt: null,
      },
      select: {
        idx: true,
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
            idx: true,
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

  async createReviewByPlaceIdx(
    createReviewInput: CreateReviewInput,
  ): Promise<SelectReview> {
    const { placeIdx, userIdx, content, imagePathList, keywordIdxList } =
      createReviewInput;
    return await this.txHost.tx.review.create({
      select: {
        idx: true,
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
            idx: true,
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
      where: {
        userIdx,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        idx: true,
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
            idx: true,
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

  async updateReviewByReviewIdx(
    reviewIdx: number,
    updateReviewInput: UpdateReviewInput,
  ): Promise<SelectReview> {
    const { content, imagePathList, keywordIdxList } = updateReviewInput;
    const updateData: { content?: string } = {};

    if (content) {
      updateData.content = content;
    }

    return await this.txHost.tx.review.update({
      select: {
        idx: true,
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
            idx: true,
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
      where: { idx: reviewIdx, deletedAt: null },
      data: {
        ...updateData,
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
