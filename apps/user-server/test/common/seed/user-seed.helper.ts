import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { SeedHelper } from './base/seed.helper';
import { UserSeedInput } from './input/user-seed.input';
import { faker } from '@faker-js/faker';

/**
 * User 테이블 시딩을 위한 헬퍼 클래스
 *
 * @author 조희주
 */
// export class UserSeedHelper extends SeedHelper<UserSeedInput> {
//   constructor(private readonly prisma: PrismaService) {
//     super();
//   }

//   private async generateNickname(): Promise<string> {
//     const maxIdxUser = await this.prisma.user.findFirst({
//       orderBy: { idx: 'desc' },
//       select: { idx: true },
//     });

//     const nextNumber = maxIdxUser ? maxIdxUser.idx + 1 : 1;
//     return `${nextNumber}번째 인후러`;
//   }

//   async seed(input: Partial<UserSeedInput> = {}) {
//     const nickname =
//       input.nickname !== undefined
//         ? input.nickname
//         : await this.generateNickname();

//     const profileImagePath =
//       input.profileImagePath !== undefined
//         ? input.profileImagePath
//         : `user/${faker.string.alphanumeric(10)}.jpg`;

//     const createdAt =
//       input.createdAt !== undefined ? input.createdAt : faker.date.recent();

//     const deletedAt = input.deletedAt !== undefined ? input.deletedAt : null;

//     const provider =
//       input.provider ?? faker.helpers.arrayElement(Object.values(AuthProvider));

//     const snsId =
//       input.snsId !== undefined ? input.snsId : faker.string.numeric(16);

//     return this.prisma.user.create({
//       data: {
//         nickname,
//         profileImagePath,
//         createdAt,
//         deletedAt,
//         userProvider: {
//           create: {
//             name: provider,
//             snsId,
//           },
//         },
//       },
//       include: {
//         userProvider: true,
//       },
//     });
//   }
// }
