/**
 * 인증 제공자 상수
 *
 * @publicApi
 */
export const AUTH_PROVIDER = {
  KAKAO: 'kakao',
  APPLE: 'apple',
} as const;

/**
 * 인증 제공자 타입
 *
 * @publicApi
 */
export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
