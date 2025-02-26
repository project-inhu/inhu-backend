import { AuthProvider } from 'src/auth/enums/auth-provider.enum';

/**
 * 소셜 로그인 후 받은 사용자 정보에서 필요한 값(id, 제공자)을 추출하여 저장하는 DTO
 *
 * @author 이수인
 */
export class SocialUserInfoDto {
  /**
   * 소셜 로그인 제공자에서 발급한 사용자 고유 ID
   */
  id: string;

  /**
   * 사용자가 로그인한 소셜 제공자 (AuthProvider Enum)
   */
  provider: AuthProvider;
}
