import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import { OAuthInfo } from '@user/api/auth/types/OAuthInfo';
import { Request } from 'express';

export interface ISocialLoginStrategy {
  getSocialLoginRedirect(): string;

  socialLogin(provider: AuthProvider, req: Request): Promise<OAuthInfo>;
}
