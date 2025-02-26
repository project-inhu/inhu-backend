import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { UserRepository } from '../repository/user.repository';

/**
 * 새로운 사용자를 위한 임시 닉네임을 생성하는 함수
 * - 기존 사용자 수를 기준으로 "N번째 인후러" 형식의 닉네임을 생성
 *
 * @author 조희주
 */
export async function generateTemporaryNickname(
  userRepository: UserRepository,
): Promise<string> {
  const userCount = await userRepository.getUserCount();
  const nickname = `${userCount + 1}번째 인후러`;
  return nickname;
}
