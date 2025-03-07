import { ApiProperty } from '@nestjs/swagger';
import { WEEKS } from '../common/constants/weeks.constant';
import { WeekInfoDto } from './week-info.dto';

export class WeekScheduleDto {
  @ApiProperty({ type: () => WeekInfoDto, example: null })
  [WEEKS.MON]: WeekInfoDto | null = null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.TUE]: WeekInfoDto | null = null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.WED]: WeekInfoDto | null = null;

  @ApiProperty({ type: () => WeekInfoDto, example: null })
  [WEEKS.THU]: WeekInfoDto | null = null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.FRI]: WeekInfoDto | null = null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.SAT]: WeekInfoDto | null = null;

  @ApiProperty({ type: () => WeekInfoDto })
  [WEEKS.SUN]: WeekInfoDto | null = null;
}
