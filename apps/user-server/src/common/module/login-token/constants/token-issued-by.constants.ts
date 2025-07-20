export const TokenIssuedBy = {
  APP: 0,
  WEB: 1,
} as const;

export type TokenIssuedBy = (typeof TokenIssuedBy)[keyof typeof TokenIssuedBy];
