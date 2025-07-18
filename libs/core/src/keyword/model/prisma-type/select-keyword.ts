import { Prisma } from '@prisma/client';

const SELECT_KEYWORD = Prisma.validator<Prisma.KeywordDefaultArgs>()({
  select: {
    idx: true,
    content: true,
  },
});

export type SelectKeyword = Prisma.KeywordGetPayload<typeof SELECT_KEYWORD>;
