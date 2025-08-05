import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { IsKoreanTime } from '@libs/common/decorator/is-korean-time.decorator';
import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { PlaceBreakTimeModel } from '@libs/core/place/model/place-break-time.model';
import { IsEnum, IsIn, IsString } from 'class-validator';

export class PlaceBreakTimeEntity {
  /**
   * 브레이크 타임 인덱스
   *
   * @example 4
   */
  public idx: number;

  /**
   * 브레이크 타임 시작 시간
   *
   * @example "12:00:00"
   */
  @IsString()
  @IsKoreanTime()
  public startAt: string;

  /**
   * 브레이크 타임 종료 시간
   *
   * @example "13:00:00"
   */
  @IsString()
  @IsKoreanTime()
  public endAt: string;

  /**
   * 요일
   *
   * @example 0 (일요일)
   */
  @IsEnumValue(DayOfWeek)
  public day: DayOfWeek;

  constructor(data: PlaceBreakTimeEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceBreakTimeModel): PlaceBreakTimeEntity {
    return new PlaceBreakTimeEntity({
      idx: model.idx,
      startAt: model.startAt,
      endAt: model.endAt,
      day: model.day,
    });
  }
}
