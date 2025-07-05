import { IsDate } from 'class-validator';
import { PlaceBreakTimeInfo } from './place-break-time-info.type';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 요일별 영업시간 및 브레이크타임
 */
export class PlaceWeekInfo {
  /**
   * 영업 시작 시간
   */
  @IsDate()
  startAt: Date;

  /**
   * 영업 종료 시간
   */
  @IsDate()
  endAt: Date;

  /**
   * 브레이크 타임 구간
   */
  @ApiProperty({ type: () => [PlaceBreakTimeInfo] })
  breakTimeList?: PlaceBreakTimeInfo[];
}
