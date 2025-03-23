import { Prisma } from '@prisma/client';

/**
 * Prisma에서 조회된 사용자 데이터
 *
 * `UserEntity`로 변환되기 전의 원시 데이터
 *
 * @author 조희주
 */
const USER_SELECT_FIELD = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    nickname: true,
    profileImagePath: true,
    createdAt: true,
    deletedAt: true,
    userProvider: {
      select: {
        snsId: true,
        name: true,
      },
    },
    bookmark: {
      select: {
        idx: true,
        placeIdx: true,
      },
    },
    review: {
      select: {
        idx: true,
        content: true,
      },
    },
  },
});

/**
 * `USER_SELECT_FIELD`의 Prisma 반환 타입
 */
export type UserSelectField = Prisma.UserGetPayload<typeof USER_SELECT_FIELD>;
