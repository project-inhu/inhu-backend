import { ApiProperty } from '@nestjs/swagger';
import { WEEKS } from '../common/constants/weeks.constant';
import { WeekInfo } from './week-info.type';

/**
 * 요일별 영업 시작 및 종료 시간을 나타내는 스케줄 타입
 *
 * @author 이수인
 */
export class WeekSchedule {
  @ApiProperty({ type: () => WeekInfo, example: null })
  [WEEKS.MON]: WeekInfo | null = null;

  @ApiProperty({ type: () => WeekInfo })
  [WEEKS.TUE]: WeekInfo | null = null;

  @ApiProperty({ type: () => WeekInfo })
  [WEEKS.WED]: WeekInfo | null = null;

  @ApiProperty({ type: () => WeekInfo, example: null })
  [WEEKS.THU]: WeekInfo | null = null;

  @ApiProperty({ type: () => WeekInfo })
  [WEEKS.FRI]: WeekInfo | null = null;

  @ApiProperty({ type: () => WeekInfo })
  [WEEKS.SAT]: WeekInfo | null = null;

  @ApiProperty({ type: () => WeekInfo })
  [WEEKS.SUN]: WeekInfo | null = null;
}
