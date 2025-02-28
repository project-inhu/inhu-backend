import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { GetReviewsByPlaceIdxDto } from './dto/get-reviews-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectReviewsByPlaceIdx(placeIdx: number) {
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
}
