import { Week } from './week.type';

export type WeekSchedule = Record<
  Week,
  { startAt: Date | null; endAt: Date | null } | null
>;
