import { PrismaService } from '@user/common/module/prisma/prisma.service';
import { SeedHelper } from './base/seed.helper';
import { BookmarkEntity } from '@user/api/bookmark/entity/bookmark.entity';
import { BookmarkSeedInput } from './input/bookmark-seed.input';

// export class BookmarkSeedHelper extends SeedHelper<BookmarkSeedInput> {
//   constructor(private readonly prisma: PrismaService) {
//     super();
//   }

//   async seed(input: Partial<BookmarkSeedInput> = {}): Promise<BookmarkEntity> {
//     const { userIdx: inputUserIdx, placeIdx: inputPlaceIdx } = input;

//     const user = await this.prisma.user.findUniqueOrThrow({
//       where: { idx: inputUserIdx ?? 1 },
//     });

//     const place = await this.prisma.place.findUniqueOrThrow({
//       where: { idx: inputPlaceIdx ?? 1 },
//     });

//     const createdBookmark = await this.prisma.bookmark.create({
//       data: {
//         userIdx: user.idx,
//         placeIdx: place.idx,
//       },
//     });

//     const selectedBookmark = await this.prisma.bookmark.findUniqueOrThrow({
//       where: { idx: createdBookmark.idx },
//       select: {
//         idx: true,
//         userIdx: true,
//         placeIdx: true,
//         createdAt: true,
//         deletedAt: true,
//       },
//     });

//     return BookmarkEntity.createEntityFromPrisma(selectedBookmark);
//   }
// }
