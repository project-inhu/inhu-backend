import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import { SelectUserProvider } from '@libs/core/user/model/prisma-type/select-user-provider';

/**
 * 사용자 제공자 모델
 *
 * @publicApi
 */
export class UserProviderEntity {
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

  constructor(data: UserProviderEntity) {
    Object.assign(this, data);
  }

  public static fromPrisma(provider: SelectUserProvider): UserProviderEntity {
    return new UserProviderEntity({
      snsId: provider.snsId,
      provider: provider.name as AuthProvider,
    });
  }
}
