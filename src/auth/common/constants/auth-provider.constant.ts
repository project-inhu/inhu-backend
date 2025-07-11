/**
 * 소셜 로그인 제공자 타입과 값 정의
 *
 * @author 이수인
 */

export const AUTH_PROVIDERS = {
  KAKAO: {
    name: 'kakao',
  },
  APPLE: {
    name: 'apple',
  },
} as const;

export type AuthProviderType = keyof typeof AUTH_PROVIDERS;
export type AuthProviderValue =
  (typeof AUTH_PROVIDERS)[AuthProviderType]['name'];
