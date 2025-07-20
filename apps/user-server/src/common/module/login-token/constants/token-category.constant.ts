export const TokenCategory = {
  ACCESS: 0,
  REFRESH: 1,
} as const;

export type TokenCategory = (typeof TokenCategory)[keyof typeof TokenCategory];
