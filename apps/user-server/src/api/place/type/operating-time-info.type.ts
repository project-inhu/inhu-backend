import { IsString } from 'class-validator';
import { BreakTimeInfo } from './break-time-info.type';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 요일별 영업시간 및 브레이크타임 블록
 *
 * @author 강정연
 *
 * @deprecated
 */
export class OperatingTimeInfo {
  @ApiProperty({ description: '영업 시작 시간', example: '09:00:00' })
  @IsString()
  startAt: string;

  @ApiProperty({ description: '영업 종료 시간', example: '22:00:00' })
  @IsString()
  endAt: string;

  @ApiProperty({
    type: () => [BreakTimeInfo],
    description: '브레이크 타임 정보',
  })
  breakTimeList?: BreakTimeInfo[];
}
