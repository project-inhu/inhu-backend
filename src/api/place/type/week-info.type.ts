import { IsDate } from 'class-validator';

/**
 * 영업 시작 및 종료 시간을 나타내는 class
 *
 * @author 이수인
 */
export class WeekInfo {
  /**
   * 영업 시작 시간
   */
  @IsDate()
  startAt: Date | null;

  /**
   * 영업 종료 시간
   */
  @IsDate()
  endAt: Date | null;
}
