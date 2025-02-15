export enum AuthProvider {
  KAKAO = 'kakao',
}

export function getAuthProviderNumber(provider: AuthProvider): number {
  switch (provider) {
    case AuthProvider.KAKAO:
      return 0;
    default:
      return -1;
  }
}
