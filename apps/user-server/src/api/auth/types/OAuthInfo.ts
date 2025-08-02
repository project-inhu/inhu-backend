import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';

export type OAuthInfo = {
  provider: AuthProvider;
  snsId: string;
};
