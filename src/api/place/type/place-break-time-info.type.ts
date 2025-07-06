import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 단일 브레이크타임 구간 정보
 *
 * @author 강정연
 */
export class PlaceBreakTimeInfo {
  /**
   * 브레이크타임 시작 시간
   *
   * @example '12:00:00'
   */
  @IsString()
  startAt: string;

  /**
   * 브레이크타임 종료 시간
   *
   * @example '13:00:00'
   */
  @IsString()
  endAt: string;
}
