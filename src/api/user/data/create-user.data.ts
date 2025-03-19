/**
 * repository layer에서 사용되는 소셜 로그인 후 사용자 등록을 위한 input
 *
 * @author 조희주
 */
export class CreateUserData {
  snsId: string;
  provider: string;
  nickname: string;

  constructor(snsId: string, provider: string, nickname: string) {
    this.snsId = snsId;
    this.provider = provider;
    this.nickname = nickname;
  }
}
