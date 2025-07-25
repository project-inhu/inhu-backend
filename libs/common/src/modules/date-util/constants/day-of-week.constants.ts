export const dayOfWeeks = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
} as const;

export type DayOfWeek = (typeof dayOfWeeks)[keyof typeof dayOfWeeks];
