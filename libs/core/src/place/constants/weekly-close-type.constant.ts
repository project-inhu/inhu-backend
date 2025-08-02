/**
 * 주간 휴무 타입 상수
 *
 * @publicApi
 */
export const WEEKLY_CLOSE_TYPE = {
  /**
   * 격주 휴무
   */
  BIWEEKLY: 0,
} as const;

/**
 * 주간 휴무 타입
 *
 * @publicApi
 */
export type WeeklyCloseType =
  (typeof WEEKLY_CLOSE_TYPE)[keyof typeof WEEKLY_CLOSE_TYPE];
