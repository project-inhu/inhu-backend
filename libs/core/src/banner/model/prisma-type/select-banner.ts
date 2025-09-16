import { Prisma } from '@prisma/client';

export const SELECT_BANNER = Prisma.validator<Prisma.BannerDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    imagePath: true,
    link: true,
    sortOrder: true,
    activatedAt: true,
    createdAt: true,
  },
});

export type SelectBanner = Prisma.BannerGetPayload<typeof SELECT_BANNER>;
