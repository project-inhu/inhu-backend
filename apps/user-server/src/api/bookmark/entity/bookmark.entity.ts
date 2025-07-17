import { BookmarkSelectField } from '../type/bookmark-select-field';

/**
 * 북마크 엔티티 클래스
 *
 * @author 강정연
 */
export class BookmarkEntity {
  /**
   * bookmark idx
   *
   * @example 1
   */
  idx: number;

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
   * bookmark 삭제 날짜
   *
   * @example '2024-03-12T10:04:54.999Z'
   */
  deletedAt: Date | null;

  /**
   * BookmarkEntity 객체를 생성하는 생성자
   */
  constructor(data: BookmarkEntity) {
    Object.assign(this, data);
  }

  /**
   * Prisma에서 조회한 리뷰 데이터를 `BookmarkEntity`로 변환함
   */
  static createEntityFromPrisma(review: BookmarkSelectField): BookmarkEntity {
    return new BookmarkEntity({
      idx: review.idx,
      userIdx: review.userIdx,
      placeIdx: review.placeIdx,
      createdAt: review.createdAt,
      deletedAt: review.deletedAt,
    });
  }
}
