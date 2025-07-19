import { AuthProvider } from '../constants/auth-provider.constant';
import { SelectUserProvider } from '../model/prisma-type/select-user-provider';

export class UserProviderModel {
  /**
   * SNS ID
   *
   * @example "3906895819"
   */
  public snsId: string;

  /**
   * SNS provider
   *
   * @example "kakao"
   */
  public provider: AuthProvider;

  constructor(data: UserProviderModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(provider: SelectUserProvider): UserProviderModel {
    return new UserProviderModel({
      snsId: provider.snsId,
      provider: provider.name as AuthProvider,
    });
  }
}
