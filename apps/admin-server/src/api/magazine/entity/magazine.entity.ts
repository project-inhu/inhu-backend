import { MagazineModel } from '@libs/core/magazine/model/magazine.model';
import { MagazinePlaceEntity } from './magazine-place.entity';

export class MagazineEntity {
  /**
   * 매거진 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 매거진 제목
   *
   * @example "맛집 탐방"
   */
  public title: string;

  /**
   * 매거진 내용
   *
   * @example "이번 주말에 가볼 만한 맛집을 소개합니다."
   */
  public content: string;

  /**
   * 썸네일 이미지 경로
   *
   * @example "/magazine/thumbnail1.jpg"
   */
  public thumbnailImagePath: string | null;

  /**
   * 썸네일 제목 표시 여부
   *
   * @example false
   */
  public isTitleVisible: boolean;

  /**
   * 생성 시간
   *
   * @example "2025-10-09T12:00:00Z"
   */
  public createdAt: Date;

  /**
   * 활성화 시간
   *
   * @example "2025-10-10T12:00:00Z"
   */
  public activatedAt: Date | null;

  /**
   * 매거진 장소 리스트
   */
  public placeList: MagazinePlaceEntity[];

  constructor(data: MagazineEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: MagazineModel): MagazineEntity {
    return new MagazineEntity({
      idx: model.idx,
      title: model.title,
      content: model.content,
      thumbnailImagePath: model.thumbnailImagePath,
      isTitleVisible: model.isTitleVisible,
      createdAt: model.createdAt,
      activatedAt: model.activatedAt,
      placeList: model.placeList.map(MagazinePlaceEntity.fromModel),
    });
  }
}
