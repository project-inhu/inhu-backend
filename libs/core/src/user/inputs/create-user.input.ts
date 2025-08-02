/**
 * 사용자 생성 입력 input
 *
 * @publicApi
 */
export class CreateUserInput {
  nickname: string;
  profileImagePath: string | null;
  social?: {
    snsId: string;
    provider: string;
  };
}
