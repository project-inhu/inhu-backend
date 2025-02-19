import { PrismaService } from 'src/common/module/prisma/prisma.service';

/**
 * 새로운 사용자를 위한 임시 닉네임을 생성하는 함수
 * - 기존 사용자 수를 기준으로 "N번째 인후러" 형식의 닉네임을 생성
 *
 * @param prisma PrismaService 인스턴스 (DB 접근을 위해 필요)
 * @returns 생성된 고유 닉네임 (string)
 *
 * @example
 * const nickname = await generateTemporaryNickname(prisma);
 * console.log(nickname); // 예: "101번째 인후러"
 *
 * @author 조희주
 */
export async function generateTemporaryNickname(
  prisma: PrismaService,
): Promise<string> {
  const userCount = await prisma.user.count();
  const nickname = `${userCount + 1}번째 인후러`;
  return nickname;
}
