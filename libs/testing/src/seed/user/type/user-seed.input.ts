import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';

/**
 * 유저 시드 입력 타입 정의
 *
 * @publicApi
 */
export type UserSeedInput = {
  nickname?: string;
  profileImagePath?: string | null;
  social?: {
    provider?: AuthProvider;
    snsId?: string;
  } | null;
  deletedAt?: Date | null;
};
