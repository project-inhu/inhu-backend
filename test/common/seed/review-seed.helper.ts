import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { SeedHelper } from './base/seed.helper';
import { ReviewSeedInput } from './input/review-seed.input';
import { ReviewEntity } from 'src/api/review/entity/review.entity';
import {
  getRandomContent,
  getRandomImagePathList,
  getRandomInt,
  getRandomKeywordPairList,
} from './utils/random-utils';

export class ReviewSeedHelper extends SeedHelper<ReviewSeedInput> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async seed(input: Partial<ReviewSeedInput> = {}): Promise<ReviewEntity> {
    const {
      userIdx: inputUserIdx,
      placeIdx: inputPlaceIdx,
      content: inputContent,
      keywordIdxList: inputKeywordIdxList,
      imagePathList: inputImagePathList,
    } = input;

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { idx: inputUserIdx || getRandomInt(1, 4) },
    });

    const place = await this.prisma.place.findUniqueOrThrow({
      where: { idx: inputPlaceIdx || getRandomInt(1, 2) },
    });

    const finalContent = inputContent ?? getRandomContent();

    const finalKeywordIdxList =
      inputKeywordIdxList ||
      (await getRandomKeywordPairList(this.prisma))
        .map((k) => k.idx)
        .sort((a, b) => a - b);

    const finalImagePathList = inputImagePathList ?? getRandomImagePathList();

    const createdReview = await this.prisma.review.create({
      data: {
        userIdx: user.idx,
        placeIdx: place.idx,
        content: finalContent,
        reviewKeywordMapping: {
          create: finalKeywordIdxList.map((keywordIdx) => ({ keywordIdx })),
        },
        reviewImage: {
          create: finalImagePathList.map((path) => ({ path })),
        },
      },
      include: {
        reviewKeywordMapping: { include: { keyword: true } },
        reviewImage: true,
        place: true,
        user: true,
      },
    });

    return ReviewEntity.createEntityFromPrisma(createdReview);
  }
}
