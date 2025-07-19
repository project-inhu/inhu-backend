import { AuthProvider } from '@libs/core';

export type OAuthInfo = {
  provider: AuthProvider;
  snsId: string;
};
