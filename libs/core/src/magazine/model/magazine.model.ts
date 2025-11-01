import { MagazinePlaceModel } from './magazine-place.model';
import { SelectMagazine } from './prisma-type/select-magazine';

export class MagazineModel {
  /**
   * 매거진 식별자
   */
  public idx: number;

  /**
   * 매거진 제목
   */
  public title: string;

  /**
   * 매거진 설명
   */
  public description: string | null;

  /**
   * 매거진 내용
   */
  public content: string;

  /**
   * 썸네일 이미지 경로
   */
  public thumbnailImagePath: string | null;

  /**
   * 썸네일 제목 표시 여부
   */
  public isTitleVisible: boolean;

  /**
   * 좋아요 수
   */
  public likeCount: number;

  /**
   * 조회 수
   */
  public viewCount: number;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  /**
   * 활성화 시간
   */
  public activatedAt: Date | null;

  /**
   * 고정 시간
   */
  public pinnedAt: Date | null;

  /**
   * 매거진 장소 리스트
   */
  public placeList: MagazinePlaceModel[];

  constructor(data: MagazineModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(magazine: SelectMagazine): MagazineModel {
    return new MagazineModel({
      idx: magazine.idx,
      title: magazine.title,
      description: magazine.description,
      content: magazine.content,
      thumbnailImagePath: magazine.thumbnailImagePath,
      isTitleVisible: magazine.isTitleVisible,
      likeCount: magazine.likeCount,
      viewCount: magazine.viewCount,
      createdAt: magazine.createdAt,
      activatedAt: magazine.activatedAt,
      pinnedAt: magazine.pinnedAt,
      placeList: magazine.placeList.map((mp) =>
        MagazinePlaceModel.fromPrisma(mp),
      ),
    });
  }
}
