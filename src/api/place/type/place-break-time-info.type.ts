import { IsDate } from 'class-validator';

/**
 * 단일 브레이크타임 구간 정보
 */
export class PlaceBreakTimeInfo {
  /**
   * 브레이크타임 시작 시간
   */
  @IsDate()
  startAt: Date;

  /**
   * 브레이크타임 종료 시간
   */
  @IsDate()
  endAt: Date;
}
