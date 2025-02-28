import { ApiProperty } from '@nestjs/swagger';
import { WEEKS } from '../common/constants/weeks.constant';
import { WeekInfoDto } from './week-info.dto';

export class WeekScheduleDto {
  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.MON]: WeekInfoDto | null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.TUE]: WeekInfoDto | null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.WED]: WeekInfoDto | null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.THU]: WeekInfoDto | null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.FRI]: WeekInfoDto | null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.SAT]: WeekInfoDto | null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.SUN]: WeekInfoDto | null;
}
