import { ReviewQueryResult } from '../interfaces/review-query-result.interface';

/**
 * 리뷰 엔티티 클래스
 * Prisma에서 조회한 리뷰 데이터를 객체 형태로 변환하여 사용
 *
 * @author 강정연
 */
export class ReviewEntity {
  idx: number;
  userIdx: number;
  placeIdx: number;
  content: string;
  createdAt: Date;
  imagePath: string[];
  keyword: string[];
  userNickName: string;
  placeName: string;

  /**
   * ReviewEntity 객체를 생성하는 생성자
   */
  constructor(data: ReviewEntity) {
    Object.assign(this, data);
  }

  /**
   * Prisma에서 조회한 리뷰 데이터를 `ReviewEntity`로 변환함
   */
  static createEntityFromPrisma(review: ReviewQueryResult): ReviewEntity {
    return new ReviewEntity({
      idx: review.idx,
      userIdx: review.userIdx,
      placeIdx: review.placeIdx,
      content: review.content,
      createdAt: review.createdAt,
      imagePath: review.reviewImage.map((img) => img.imagePath ?? ''),
      keyword: review.reviewKeywordMapping.map(
        (mapping) => mapping.keyword.content,
      ),
      userNickName: review.user.nickname,
      placeName: review.place.name,
    });
  }
}
