import { SELECT_USER_PROVIDER } from './select-user-provider';
import { Prisma } from '@prisma/client';

export const SELECT_USER = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    nickname: true,
    profileImagePath: true,
    createdAt: true,
    userProvider: SELECT_USER_PROVIDER,
  },
});

export type SelectUser = Prisma.UserGetPayload<typeof SELECT_USER>;
