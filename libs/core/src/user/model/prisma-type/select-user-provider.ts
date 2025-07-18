import { Prisma } from '@prisma/client';

export const SELECT_USER_PROVIDER =
  Prisma.validator<Prisma.UserProviderDefaultArgs>()({
    select: {
      name: true,
      snsId: true,
    },
  });

export type SelectUserProvider = Prisma.UserProviderGetPayload<
  typeof SELECT_USER_PROVIDER
>;
