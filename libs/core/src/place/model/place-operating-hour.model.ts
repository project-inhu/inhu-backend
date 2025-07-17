/**
 * 운영 시간 정보
 */
export class PlaceOperatingHourModel {
  /**
   * 운영 정보 시간 식별자
   *
   * !주의: 장소 식별자가 아닙니다.
   */
  public idx: number;

  /**
   * 시작 시간
   */
  public startAt: Date;

  /**
   * 종료 시간
   */
  public endAt: Date;

  constructor(data: PlaceOperatingHourModel) {
    Object.assign(this, data);
  }
}
