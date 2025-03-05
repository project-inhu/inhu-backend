import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { ReviewQueryResult } from './interfaces/review-query-result.interface';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async selectReviewByReviewIdx(
    idx: number,
  ): Promise<ReviewQueryResult | null> {
    return await this.prisma.review.findUnique({
      where: {
        idx,
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

  async createReviewByPlaceIdx(
    placeIdx: number,
    content: string,
    userIdx: number,
    reviewImages: string[],
    keywordIdxs: number[],
  ): Promise<{ idx: number }> {
    const review = await this.prisma.review.create({
      data: {
        placeIdx,
        content,
        userIdx,
        reviewImage: {
          create: reviewImages.map((imagePath) => ({
            imagePath,
          })),
        },
        reviewKeywordMapping: {
          create: keywordIdxs.map((keywordIdx) => ({
            keyword: {
              connect: { idx: keywordIdx },
            },
          })),
        },
      },
      select: { idx: true },
    });

    return review;
  }
}
