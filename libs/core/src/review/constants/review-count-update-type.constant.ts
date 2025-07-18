export const REVIEW_COUNT_UPDATE_TYPE = {
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE',
} as const;

export type ReviewCountUpdateType =
  (typeof REVIEW_COUNT_UPDATE_TYPE)[keyof typeof REVIEW_COUNT_UPDATE_TYPE];
