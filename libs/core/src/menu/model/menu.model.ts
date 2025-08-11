import { SelectMenu } from './prisma-type/select-menu';

/**
 * Menu 모델
 *
 * @publicApi
 */
export class MenuModel {
  /**
   * 메뉴 식별자
   */
  public idx: number;

  /**
   * 장소 식별자
   */
  public placeIdx: number;

  /**
   * 메뉴 이름
   */
  public name: string;

  /**
   * 메뉴 설명
   */
  public content: string | null;

  /**
   * 메뉴 가격
   */
  public price: number | null;

  /**
   * 메뉴 이미지 경로
   */
  public imagePath: string | null;

  /**
   * 시가 여부
   * - true: 시가
   * - false: 비시가
   */
  public isFlexible: boolean;

  /**
   * 정렬 순서 (낮은 숫자가 우선)
   */
  public sortOrder: number;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  constructor(data: MenuModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(menu: SelectMenu): MenuModel {
    return new MenuModel({
      idx: menu.idx,
      placeIdx: menu.placeIdx,
      name: menu.name,
      content: menu.content,
      price: menu.price,
      imagePath: menu.imagePath,
      isFlexible: menu.isFlexible,
      sortOrder: menu.sortOrder,
      createdAt: menu.createdAt,
    });
  }
}
