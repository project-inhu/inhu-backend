import { ApiProperty } from '@nestjs/swagger';
import { WEEKS } from '../common/constants/weeks.constant';
import { OperatingTimeInfo } from './operating-time-info.type';

/**
 * 전체 요일별 영업 시간표
 * 각 요일에 여러 개의 영업 시간 블록이 올 수 있음
 *
 * @author 강정연
 */
export class OperatingWeekSchedule {
  @ApiProperty({ type: () => [OperatingTimeInfo] })
  [WEEKS.MON]: OperatingTimeInfo[] | null = null;

  @ApiProperty({ type: () => [OperatingTimeInfo] })
  [WEEKS.TUE]: OperatingTimeInfo[] | null = null;

  @ApiProperty({ type: () => [OperatingTimeInfo] })
  [WEEKS.WED]: OperatingTimeInfo[] | null = null;

  @ApiProperty({ type: () => [OperatingTimeInfo] })
  [WEEKS.THU]: OperatingTimeInfo[] | null = null;

  @ApiProperty({ type: () => [OperatingTimeInfo] })
  [WEEKS.FRI]: OperatingTimeInfo[] | null = null;

  @ApiProperty({ type: () => [OperatingTimeInfo] })
  [WEEKS.SAT]: OperatingTimeInfo[] | null = null;

  @ApiProperty({ type: () => [OperatingTimeInfo] })
  [WEEKS.SUN]: OperatingTimeInfo[] | null = null;
}
