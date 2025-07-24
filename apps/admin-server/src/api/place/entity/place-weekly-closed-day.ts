import { IsKoreanDate } from '@libs/common';
import {
  PlaceWeeklyClosedDayModel,
  WEEKLY_CLOSE_TYPE,
  WeeklyCloseType,
} from '@libs/core';
import { IsIn, IsString } from 'class-validator';

export class PlaceWeeklyClosedDayEntity {
  /**
   * 주간 휴무일 인덱스
   *
   * @example 1
   */
  public idx: number;

  /**
   * 휴무 날짜 (한국 날짜)
   *
   * @example '2023-10-01'
   */
  @IsString()
  @IsKoreanDate()
  public date: string;

  /**
   * 휴무 타입
   *
   * @example 0
   */
  @IsIn(Object.values(WEEKLY_CLOSE_TYPE))
  public type: WeeklyCloseType;

  constructor(data: PlaceWeeklyClosedDayEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceWeeklyClosedDayModel,
  ): PlaceWeeklyClosedDayEntity {
    return new PlaceWeeklyClosedDayEntity({
      idx: model.idx,
      date: model.date,
      type: model.type,
    });
  }
}
