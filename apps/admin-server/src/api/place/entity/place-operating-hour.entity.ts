import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { IsKoreanTime } from '@libs/common/decorator/is-korean-time.decorator';
import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { PlaceOperatingHourModel } from '@libs/core/place/model/place-operating-hour.model';
import { IsString } from 'class-validator';

export class PlaceOperatingHourEntity {
  /**
   * 운영 시간 인덱스
   *
   * @example 2
   */
  public idx: number;

  /**
   * 운영 시작 시간
   *
   * @example "09:00:00"
   */
  @IsString()
  @IsKoreanTime()
  public startAt: string;

  /**
   * 운영 종료 시간
   *
   * @example "18:00:00"
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

  constructor(data: PlaceOperatingHourEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceOperatingHourModel) {
    return new PlaceOperatingHourEntity({
      idx: model.idx,
      startAt: model.startAt,
      endAt: model.endAt,
      day: model.day,
    });
  }
}
