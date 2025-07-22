import { BookmarkModel } from '@libs/core';

/**
 * 북마크 엔티티 클래스
 *
 * @author 이수인
 */
export class BookmarkEntity {
  /**
   * bookmark 등록자 idx
   *
   * @example 1
   */
  userIdx: number;

  /**
   * bookmark 등록할 place idx
   *
   * @example 1
   */
  placeIdx: number;

  /**
   * bookmark 등록 날짜
   *
   * @example '2024-03-11T12:34:56.789Z'
   */
  createdAt: Date;

  /**
   * BookmarkEntity 객체를 생성하는 생성자
   */
  constructor(data: BookmarkEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: BookmarkModel): BookmarkEntity {
    return new BookmarkEntity({
      userIdx: model.userIdx,
      placeIdx: model.placeIdx,
      createdAt: model.createdAt,
    });
  }
}
