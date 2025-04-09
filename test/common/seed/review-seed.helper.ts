import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { SeedHelper } from './base/seed.helper';
import { ReviewSeedInput } from './input/review-seed.input';

export class ReviewSeedHelper extends SeedHelper<ReviewSeedInput> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async seed(input: Partial<ReviewSeedInput> = {}) {
    const {
      content = 'initial content',
      keywordIdxList,
      imagePathList,
    } = input;

    const user = await this.prisma.user.create({
      data: {
        nickname: 'test-review-user',
      },
    });

    const place = await this.prisma.place.create({
      data: {
        name: '테스트 장소',
        tel: '010-0000-0000',
        address: '서울시 어딘가',
        addressX: 0,
        addressY: 0,
      },
    });

    const defaultKeywordList = ['cozy', 'tasty', 'quiet'];

    await this.prisma.keyword.createMany({
      data: defaultKeywordList.map((content) => ({ content })),
      skipDuplicates: true,
    });

    const keywordList = await this.prisma.keyword.findMany({
      where: { content: { in: defaultKeywordList } },
    });

    const finalKeywordIdxList =
      keywordIdxList ??
      this.getRandomSubset(
        keywordList.map((k) => k.idx),
        this.getRandomInt(1, keywordList.length),
      );

    const finalImagePathList = imagePathList ?? [
      'images/review/default1.jpg',
      'images/review/default2.jpg',
    ];

    // ✅ review 생성
    return this.prisma.review.create({
      data: {
        userIdx: user.idx,
        placeIdx: place.idx,
        content,
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
  }

  private getRandomSubset<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
