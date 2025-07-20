import { DayOfWeek } from '@libs/common';
import { PlaceType, WeeklyCloseType } from '@libs/core';

export type PlaceSeedInput = {
  name?: string;
  tel?: string | null;
  /**
   * @default 0
   */
  reviewCount?: number;

  /**
   * @default 0
   */
  bookmarkCount?: number;

  /**
   * @default false
   */
  isClosedOnHoliday?: boolean;
  deletedAt: Date | null;
  permanentlyClosedAt?: Date | null;
  activatedAt?: Date | null;
  placeImgList?: string[];
  type?: PlaceType;
  roadAddress?: {
    name?: string;
    detail?: string | null;
    addressX?: number;
    addressY?: number;
  };
  closedDayList?:
    | {
        day: number;
        dayOfWeek: DayOfWeek;
      }[]
    | null;
  operatingHourList?:
    | {
        startAt: Date;
        endAt: Date;
        day: DayOfWeek;
      }[]
    | null;
  weeklyClosedDayList?:
    | {
        closedDate: Date;
        type: WeeklyCloseType;
      }[]
    | null;
  breakTime?:
    | {
        startAt: Date;
        endAt: Date;
        day: DayOfWeek;
      }[]
    | null;
  keywordCountList?:
    | {
        keywordIdx: number;
        count: number;
      }[]
    | null;
};
