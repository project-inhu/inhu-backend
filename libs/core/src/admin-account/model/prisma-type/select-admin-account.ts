import { Prisma } from '@prisma/client';

export const SELECT_ADMIN_ACCOUNT =
  Prisma.validator<Prisma.AdminAccountDefaultArgs>()({
    select: {
      idx: true,
      id: true,
      pw: true,
    },
  });

export type SelectAdminAccount = Prisma.AdminAccountGetPayload<
  typeof SELECT_ADMIN_ACCOUNT
>;
