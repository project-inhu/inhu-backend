export const WEEKLY_CLOSE_TYPE = {
  /**
   * 격주 휴무
   */
  BIWEEKLY: 0,
} as const;

export type WeeklyCloseType =
  (typeof WEEKLY_CLOSE_TYPE)[keyof typeof WEEKLY_CLOSE_TYPE];
