import { AuthProvider } from '@libs/core';

export type UserSeedInput = {
  nickname?: string;
  profileImagePath?: string | null;
  social?: {
    provider?: AuthProvider;
    snsId?: string;
  } | null;
  deletedAt?: Date | null;
};
