import { SelectBanner } from './prisma-type/select-banner';

/**
 * Banner 모델
 *
 * @publicApi
 */
export class BannerModel {
  /**
   * 배너 식별자
   */
  public idx: number;

  /**
   * 배너 이름
   */
  public name: string;

  /**
   * 배너 이미지 경로
   */
  public imagePath: string;

  /**
   * 배너 링크
   */
  public link: string | null;

  /**
   * 배너 정렬 순서
   */
  public sortOrder: number | null;

  /**
   * 배너 시작 일시
   */
  public startAt: string;

  /**
   * 배너 종료 일시
   */
  public endAt: string | null;

  /**
   * 배너 활성화 일시
   */
  public activatedAt: Date | null;

  /**
   * 배너 생성 일시
   */
  public createdAt: Date;

  constructor(data: BannerModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(banner: SelectBanner): BannerModel {
    return new BannerModel({
      idx: banner.idx,
      name: banner.name,
      imagePath: banner.imagePath,
      link: banner.link,
      sortOrder: banner.sortOrder,
      startAt: banner.startAt.toISOString().split('T')[0],
      endAt: banner.endAt ? banner.endAt.toISOString().split('T')[0] : null,
      activatedAt: banner.activatedAt,
      createdAt: banner.createdAt,
    });
  }
}
