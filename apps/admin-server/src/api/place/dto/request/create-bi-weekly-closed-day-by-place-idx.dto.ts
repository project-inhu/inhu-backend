import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsString } from 'class-validator';

export class CreateBiWeeklyClosedDayByPlaceIdxDto {
  /**
   * 날짜 (YYYY-MM-DD)
   *
   * @example 2025-08-27
   */
  @IsString()
  @IsKoreanDate()
  date: string;
}
