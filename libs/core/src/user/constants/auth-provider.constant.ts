export const AUTH_PROVIDER = {
  KAKAO: 'kakao',
  APPLE: 'apple',
} as const;

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
