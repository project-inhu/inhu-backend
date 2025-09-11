export class CronJobErrorDetailDto {
  /**
   * 실패한 장소의 ID
   *
   * @example 1
   */
  public placeIdx: number;

  /**
   * 실패 원인 메시지
   *
   * @example "Invalid date format"
   */
  public errorMessage: string;
}
