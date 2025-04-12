import { PrismaService } from 'src/common/module/prisma/prisma.service';

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomSubset<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomImagePathList(): string[] {
  const imagePathCandidateList = [
    'images/sample1.jpg',
    'images/sample2.jpg',
    'images/sample3.jpg',
    'images/sample4.jpg',
    'images/sample5.jpg',
  ];
  const count = getRandomInt(1, imagePathCandidateList.length);
  return getRandomSubset(imagePathCandidateList, count);
}

export function getRandomContent(): string {
  const randomPhrases = [
    'The place is great, I had an amazing time!',
    'I loved the food, but the service could be better.',
    'Very quiet and peaceful place, perfect for a weekend retreat.',
    'Great ambiance, but the prices are a bit high.',
    'Highly recommend, will visit again!',
    'Good place but could improve on cleanliness.',
  ];
  return randomPhrases[getRandomInt(0, randomPhrases.length - 1)];
}

export async function getRandomKeywordPairList(
  prisma: PrismaService,
): Promise<{ idx: number; content: string }[]> {
  const keywordList = await prisma.keyword.findMany();
  const count = getRandomInt(1, 3);
  const selectedKeywords = getRandomSubset(keywordList, count);
  selectedKeywords.sort((a, b) => a.idx - b.idx);

  return selectedKeywords.map((keyword) => ({
    idx: keyword.idx,
    content: keyword.content,
  }));
}
