/**
 * 사용자 시딩을 위한 입력 값 정의
 *
 * @author 조희주
 */
export class UserSeedInput {
  nickname?: string;
  profileImagePath?: string | null;
  createdAt?: Date;
  deletedAt?: Date | null;

  provider?: string;
  snsId?: string;
}
