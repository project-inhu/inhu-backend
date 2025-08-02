import { MenuModel } from '@libs/core/menu/model/menu.model';

export class MenuEntity {
  /**
   * 메뉴 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 메뉴가 있는 장소
   *
   * @example 1
   */
  public placeIdx: number;

  /**
   * 메뉴 이름
   *
   * @example "칼국수"
   */
  public name: string;

  /**
   * 메뉴 설명
   *
   * @example "신선한 재료로 만든 칼국수입니다."
   */
  public content: string | null;

  /**
   * 메뉴 가격
   *
   * @example 8000
   */
  public price: number | null;

  /**
   * 메뉴 이미지 경로
   *
   * @example "/menu/00001.png"
   */
  public imagePath: string | null;

  /**
   * 시가 여부
   * - true: 시가
   * - false: 비시가
   */
  public isFlexible: boolean;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  constructor(data: MenuEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: MenuModel): MenuEntity {
    return new MenuEntity({
      idx: model.idx,
      placeIdx: model.placeIdx,
      name: model.name,
      content: model.content,
      price: model.price,
      imagePath: model.imagePath,
      isFlexible: model.isFlexible,
      createdAt: model.createdAt,
    });
  }
}
