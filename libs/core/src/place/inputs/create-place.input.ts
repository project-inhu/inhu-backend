import { DayOfWeek } from '@libs/common';
import { PlaceType } from '../constants/place-type.constant';
import { WeeklyCloseType } from '../constants/weekly-close-type.constant';

export class CreatePlaceInput {
  name: string;
  tel: string | null;
  isClosedOnHoliday: boolean;
  activatedAt: Date | null;
  imgList: string[];
  type: PlaceType;
  roadAddress: {
    name: string;
    detail: string | null;
    addressX: number;
    addressY: number;
  };
  permanentlyClosedAt: Date | null;
  closedDayList: {
    day: DayOfWeek;
    week: number;
  }[];
  operatingHourList: {
    startAt: Date;
    endAt: Date;
    day: DayOfWeek;
  }[];
  weeklyClosedDayList: {
    closedDate: Date;
    type: WeeklyCloseType;
  }[];
  breakTimeList: {
    startAt: Date;
    endAt: Date;
    day: DayOfWeek;
  }[];
}
