import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { PlaceType } from '../constants/place-type.constant';
import { WeeklyCloseType } from '../constants/weekly-close-type.constant';

/**
 * 장소 생성 입력 input
 *
 * @publicApi
 */
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

  /**
   * 정기 휴무일
   */
  closedDayList: {
    day: DayOfWeek;
    week: number;
  }[];

  /**
   * 운영 시간
   */
  operatingHourList: {
    /**
     * 한국 시간
     * @example '10:00:00'
     */
    startAt: string;

    /**
     * 한국 시간
     * @example '12:00:00'
     */
    endAt: string;
    day: DayOfWeek;
  }[];
  weeklyClosedDayList: {
    /**
     * 한국 날짜
     * @example '2025-07-22'
     */
    closedDate: string;
    type: WeeklyCloseType;
  }[];
  breakTimeList: {
    /**
     * 한국 시간
     * @example '10:00:00'
     */
    startAt: string;

    /**
     * 한국 시간
     * @example '12:00:00'
     */
    endAt: string;
    day: DayOfWeek;
  }[];
}
