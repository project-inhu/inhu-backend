import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { ReviewSeedHelper } from '@libs/testing/seed/review/review.seed';
import { PickedPlaceSeedHelper } from '@libs/testing/seed/picked-place/picked-place.seed';
import { MenuSeedHelper } from '@libs/testing/seed/menu/menu.seed';
import { PlaceSeedDataList } from './data/place.seed';

const prisma = new PrismaService();

async function main() {
  await prisma.onModuleInit();

  const placeSeedHelper = new PlaceSeedHelper(prisma);
  const userSeedHelper = new UserSeedHelper(prisma);
  const reviewSeedHelper = new ReviewSeedHelper(prisma);
  const pickedPlaceSeedHelper = new PickedPlaceSeedHelper(prisma);
  const menuSeedHelper = new MenuSeedHelper(prisma);

  /**
   * 사용자 생성
   */
  const user1 = await userSeedHelper.seed({
    nickname: '맛집탐방가',
    profileImagePath: '/profile/ddccb241-5fc2-4aca-9f6f-89a2b32edd68-puppy.jpg',
  });
  const user2 = await userSeedHelper.seed({ nickname: '인덕이' });
  const userList = { user1, user2 };

  /**
   * 장소 생성
   */
  for (const placeData of PlaceSeedDataList) {
    const place = await placeSeedHelper.seed(placeData);

    // 장소의 리뷰 목록 시딩
    if (placeData.reviewList && placeData.reviewList.length > 0) {
      for (const review of placeData.reviewList) {
        const user = userList[review.userKey];
        await reviewSeedHelper.seed({
          ...review,
          placeIdx: place.idx,
          userIdx: user.idx,
        });
      }
    }

    // 장소의 메뉴 목록 시딩
    if (placeData.menuList && placeData.menuList.length > 0) {
      for (const menu of placeData.menuList) {
        await menuSeedHelper.seed({
          ...menu,
          placeIdx: place.idx,
        });
      }
    }

    // 장소의 pickedPlace 목록 시딩
    if (placeData.pickedPlaceList && placeData.pickedPlaceList.length > 0) {
      for (const pickedPlace of placeData.pickedPlaceList) {
        await pickedPlaceSeedHelper.seed({
          ...pickedPlace,
          placeIdx: place.idx,
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
