import { ApiProperty } from '@nestjs/swagger';
import { WEEKS } from '../common/constants/weeks.constant';
import { PlaceWeekInfo } from './place-week-info.type';

/**
 * 전체 요일별 영업 시간표
 * 각 요일에 여러 개의 영업 시간 블록이 올 수 있음
 *
 * @author 강정연
 */
export class PlaceWeekSchedule {
  @ApiProperty({ type: () => [PlaceWeekInfo] })
  [WEEKS.MON]: PlaceWeekInfo[] | null = null;

  @ApiProperty({ type: () => [PlaceWeekInfo] })
  [WEEKS.TUE]: PlaceWeekInfo[] | null = null;

  @ApiProperty({ type: () => [PlaceWeekInfo] })
  [WEEKS.WED]: PlaceWeekInfo[] | null = null;

  @ApiProperty({ type: () => [PlaceWeekInfo] })
  [WEEKS.THU]: PlaceWeekInfo[] | null = null;

  @ApiProperty({ type: () => [PlaceWeekInfo] })
  [WEEKS.FRI]: PlaceWeekInfo[] | null = null;

  @ApiProperty({ type: () => [PlaceWeekInfo] })
  [WEEKS.SAT]: PlaceWeekInfo[] | null = null;

  @ApiProperty({ type: () => [PlaceWeekInfo] })
  [WEEKS.SUN]: PlaceWeekInfo[] | null = null;
}
