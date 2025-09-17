import { BannerModel } from '@libs/core/banner/model/banner.model';

export class BannerEntity {
  /**
   * 배너 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 배너 이름
   *
   * @example "여름 프로모션"
   */
  public name: string;

  /**
   * 배너 이미지 경로
   *
   * @example "/banner/summer-promo.jpg"
   */
  public imagePath: string;

  /**
   * 배너 링크
   *
   * @example "https://example.com/summer-promo"
   */
  public link: string | null;

  /**
   * 정렬 순서
   *
   * @example 1
   */
  public sortOrder: number | null;

  /**
   * 생성 시간
   * @example "2024-06-01T12:00:00.000Z"
   */
  public createdAt: Date;

  /**
   * 활성화 시간
   * @example "2024-06-01T12:00:00.000Z"
   */
  public activatedAt: Date | null;

  constructor(data: BannerEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: BannerModel): BannerEntity {
    return new BannerEntity({
      idx: model.idx,
      name: model.name,
      imagePath: model.imagePath,
      link: model.link,
      sortOrder: model.sortOrder,
      createdAt: model.createdAt,
      activatedAt: model.activatedAt,
    });
  }
}
