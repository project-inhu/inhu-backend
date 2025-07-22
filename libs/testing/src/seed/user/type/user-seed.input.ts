import { AuthProvider } from '@libs/core';

export type UserSeedInput = {
  nickname?: string;
  profileImagePath?: string | null;
  social?: {
    provider?: AuthProvider;
    snsId?: string;
  } | null;
  /**
   * @default false
   */
  isAdmin?: boolean;
  deletedAt?: Date | null;
};
