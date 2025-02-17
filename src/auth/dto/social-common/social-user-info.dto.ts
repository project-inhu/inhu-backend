import { AuthProvider } from 'src/auth/enum/auth-provider.enum';

/**
 * 소셜 로그인 후 받은 사용자 정보 중 필요한 값만 추출하여 저장하는 DTO
 * - 소셜 로그인 API에서 받아온 원본 데이터에서 필요한 값만 선별하여 저장
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
