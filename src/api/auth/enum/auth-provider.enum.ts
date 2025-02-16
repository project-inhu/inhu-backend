/**
 * 인증 제공자 (Auth Provider) Enum
 * - 사용자가 어떤 소셜 로그인 서비스를 이용했는지 나타냄
 */
export enum AuthProvider {
  KAKAO = 'kakao',
}

/**
 * 인증 제공자 인덱스 매핑
 * - 각 AuthProvider 값을 숫자 인덱스로 매핑하여 사용
 */
export const AuthProviderIndex: Record<AuthProvider, number> = {
  [AuthProvider.KAKAO]: 0,
};
