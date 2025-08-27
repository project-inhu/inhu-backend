import { CronJobErrorDetailDto } from './cron-job-error-detail.dto';

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
