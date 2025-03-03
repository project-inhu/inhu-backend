import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { ReviewQueryResult } from './interfaces/review-query-result.interface';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectReviewsByPlaceIdx(
    placeIdx: number,
  ): Promise<ReviewQueryResult[]> {
    const reviews = await this.prisma.review.findMany({
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
    return reviews;
  }

  async createReviewByPlaceIdx(
    placeIdx: number,
    content: string,
    userIdx: number,
  ) {
    await this.prisma.review.create({
      data: {
        placeIdx,
        content,
        userIdx,
      },
    });
  }

  async createReviewKeywordMapping(reviewIdx: number, keywordIdxs: number[]) {
    const keywordMappings = keywordIdxs.map((keywordIdx) => ({
      reviewIdx,
      keywordIdx,
    }));

    return this.prisma.reviewKeywordMapping.createMany({
      data: keywordMappings,
    });
  }
}
