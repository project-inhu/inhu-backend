import { IsDayOfWeek } from '@libs/common/decorator/is-day-of-week.decorator';
import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { PlaceClosedDayModel } from '@libs/core/place/model/place-closed-day.model';
import { IsIn, IsInt, IsNumber } from 'class-validator';

/**
 * 정기 휴무일 정보
 */
export class PlaceClosedDayEntity {
  /**
   * 휴무일 인덱스
   *
   * @example 12
   */
  public idx: number;

  /**
   * 휴무 날짜
   *
   * @example 0 (일요일)
   */
  @IsDayOfWeek()
  public day: DayOfWeek;

  /**
   * 몇 번째 주차마다 쉬는지
   */
  @IsNumber()
  @IsInt()
  @IsIn([1, 2, 3, 4, 5, 6])
  public week: number;

  constructor(data: PlaceClosedDayEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceClosedDayModel): PlaceClosedDayEntity {
    return new PlaceClosedDayEntity({
      idx: model.idx,
      day: model.day,
      week: model.week,
    });
  }
}
