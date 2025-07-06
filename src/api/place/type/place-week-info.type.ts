import { IsString } from 'class-validator';
import { PlaceBreakTimeInfo } from './place-break-time-info.type';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 요일별 영업시간 및 브레이크타임
 *
 * @author 강정연
 */
export class PlaceWeekInfo {
  /**
   * 영업 시작 시간
   *
   * @example '09:00:00'
   */
  @IsString()
  startAt: string;

  /**
   * 영업 종료 시간
   *
   * @example '22:00:00'
   */
  @IsString()
  endAt: string;

  @ApiProperty({ type: () => [PlaceBreakTimeInfo] })
  breakTimeList?: PlaceBreakTimeInfo[];
}
