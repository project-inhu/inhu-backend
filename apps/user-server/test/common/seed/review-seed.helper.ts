import { PrismaService } from '@user/common/module/prisma/prisma.service';
import { SeedHelper } from './base/seed.helper';
import { ReviewSeedInput } from './input/review-seed.input';
import { ReviewEntity } from '@user/api/review/entity/review.entity';

// export class ReviewSeedHelper extends SeedHelper<ReviewSeedInput> {
//   constructor(private readonly prisma: PrismaService) {
//     super();
//   }

//   async seed(input: Partial<ReviewSeedInput> = {}): Promise<ReviewEntity> {
//     const {
//       userIdx: inputUserIdx,
//       placeIdx: inputPlaceIdx,
//       content: inputContent,
//       keywordIdxList: inputKeywordIdxList,
//       imagePathList: inputImagePathList,
//     } = input;

//     const user = await this.prisma.user.findUniqueOrThrow({
//       where: { idx: inputUserIdx ?? 1 },
//     });

//     const place = await this.prisma.place.findUniqueOrThrow({
//       where: { idx: inputPlaceIdx ?? 1 },
//     });

//     const content = inputContent ?? 'base review';

//     const keywordIdxList = inputKeywordIdxList ?? [1, 2];

//     const imagePathList = inputImagePathList ?? [
//       'images/sample1.jpg',
//       'images/sample2.jpg',
//     ];

//     const createdReview = await this.prisma.review.create({
//       data: {
//         userIdx: user.idx,
//         placeIdx: place.idx,
//         content,
//         reviewKeywordMapping: {
//           create: keywordIdxList.map((keywordIdx) => ({ keywordIdx })),
//         },
//         reviewImage: {
//           create: imagePathList.map((path) => ({ path })),
//         },
//       },
//     });

//     const selectedReview = await this.prisma.review.findUniqueOrThrow({
//       where: { idx: createdReview.idx },
//       select: {
//         idx: true,
//         userIdx: true,
//         placeIdx: true,
//         content: true,
//         createdAt: true,
//         reviewImage: { select: { path: true } },
//         reviewKeywordMapping: {
//           select: { keyword: { select: { content: true } } },
//         },
//         user: { select: { nickname: true } },
//         place: { select: { name: true } },
//       },
//     });

//     return ReviewEntity.createEntityFromPrisma(selectedReview);
//   }
// }
