import { KeywordModel } from '@app/core/keyword/model/keyword.model';
import { SelectReview } from './prisma-type/select-review';
import { ReviewAuthorModel } from './review-author.model';
import { ReviewPlaceModel } from './review-place.model';

export class ReviewModel {
  /**
   * 리뷰 식별자
   */
  public idx: number;

  /**
   * 리뷰 내용
   */
  public content: string;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  /**
   * 이미지 경로 리스트
   */
  public imagePathList: string[];

  /**
   * 키워드 리스트
   */
  public keywordList: KeywordModel[];

  /**
   * 리뷰 작성자 정보
   */
  public author: ReviewAuthorModel;

  /**
   * 리뷰 장소 정보
   */
  public place: ReviewPlaceModel;

  constructor(data: ReviewModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(review: SelectReview): ReviewModel {
    return new ReviewModel({
      idx: review.idx,
      content: review.content,
      createdAt: review.createdAt,
      imagePathList: review.reviewImageList.map(({ path }) => path),
      keywordList: review.reviewKeywordMappingList.map(({ keyword }) =>
        KeywordModel.fromPrisma(keyword),
      ),
      author: ReviewAuthorModel.fromPrisma(review.user),
      place: ReviewPlaceModel.fromPrisma(review.place),
    });
  }
}
