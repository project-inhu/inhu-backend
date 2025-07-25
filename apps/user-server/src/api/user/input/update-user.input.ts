/**
 * 사용자 정보 수정을 위한 입력 값
 *
 * @author 조희주
 */
export class UpdateUserInput {
  userIdx: number;
  nickname?: string;
  profileImagePath?: string | null;
}
