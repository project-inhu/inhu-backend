/**
 * 일주일의 요일 상수를 정의합니다.
 *
 * @publicApi
 */
export const dayOfWeeks = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
} as const;

/**
 * 일주일의 요일 타입을 정의합니다.
 *
 * @publicApi
 */
export type DayOfWeek = (typeof dayOfWeeks)[keyof typeof dayOfWeeks];
