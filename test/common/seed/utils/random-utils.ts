import { faker } from '@faker-js/faker/.';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

export function getRandomInt(min: number, max: number): number {
  return faker.number.int({ min, max });
}

export function getRandomImagePathList(): string[] {
  const count = getRandomInt(1, 5);
  return Array.from(
    { length: count },
    (_, i) => `images/${faker.word.adjective()}_${i + 1}.jpg`,
  );
}

export function getRandomContent(min = 3, max = 400): string {
  let result = '';
  while (result.length < min) {
    result = faker.lorem.sentences(5).slice(0, max).trim();
  }
  return result;
}

export async function getRandomKeywordPairList(
  prisma: PrismaService,
): Promise<{ idx: number; content: string }[]> {
  const keywordList = await prisma.keyword.findMany();
  const count = getRandomInt(1, 3);
  const selectedKeywords = faker.helpers.arrayElements(keywordList, count);
  selectedKeywords.sort((a, b) => a.idx - b.idx);

  return selectedKeywords.map((keyword) => ({
    idx: keyword.idx,
    content: keyword.content,
  }));
}
