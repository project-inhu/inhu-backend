import { CronJobErrorDetailDto } from './cron-job-error-detail.dto';

// TODO : 에러 내역을 담아서 보내주는 용도지만 지금 응답 body로 되어 있음. 상태코드 200에 에러 body가 가는 구조임. 필요시 수정
export class RunBiWeeklyClosedDayCronJobResponseDto {
  /**
   * 성공 건수
   *
   * @example 10
   */
  public successCount: number;

  /**
   * 실패 건수
   *
   * @example 2
   */
  public failureCount: number;

  public errorList: CronJobErrorDetailDto[];
}
