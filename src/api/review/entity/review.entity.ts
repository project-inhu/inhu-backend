import { ReviewSelectField } from '../common/constants/review-select-field';

/**
 * 리뷰 엔티티 클래스
 *
 * @author 강정연
 */
export class ReviewEntity {
  /**
   * review idx
   *
   * @example 1
   */
  idx: number;

  /**
   * review 작성자 idx
   *
   * @example 1
   */
  userIdx: number;

  /**
   * review 등록할 place idx
   *
   * @example 1
   */
  placeIdx: number;

  /**
   * review content
   *
   * @example '너무 맛있어요!'
   */
  content: string;

  /**
   * review 생성 날짜
   *
   * @example '2024-03-11T12:34:56.789Z'
   */
  createdAt: Date;

  /**
 * review 사진 path list
 *
 * @example ['images/review/1/20240312/171923.jpg',
      'images/review/1/20240312/17234.jpg']
 */
  imagePathList: string[];

  /**
   * review keyword list
   *
   * @example ['맛있어요.', '가성비 좋아요.']
   */
  keywordList: string[];

  /**
   * review 작성자 nickname
   *
   * @example 'gongsil'
   */
  userNickName: string;

  /**
   * review 등록할 place name
   *
   * @example '동아리 닭갈비'
   */
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
  static createEntityFromPrisma(review: ReviewSelectField): ReviewEntity {
    return new ReviewEntity({
      idx: review.idx,
      userIdx: review.userIdx,
      placeIdx: review.placeIdx,
      content: review.content,
      createdAt: review.createdAt,
      imagePathList: review.reviewImage.map(({ path }) => path),
      keywordList: review.reviewKeywordMapping.map(
        ({ keyword: { content } }) => content,
      ),
      userNickName: review.user.nickname,
      placeName: review.place.name,
    });
  }
}
