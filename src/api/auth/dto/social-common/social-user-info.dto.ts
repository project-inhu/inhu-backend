import { AuthProvider } from '../../enum/auth-provider.enum';

export class SocialUserInfoDto {
  id: string;
  provider: AuthProvider;
}
