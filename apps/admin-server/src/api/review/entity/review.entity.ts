import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';
import { ReviewAuthorEntity } from './review-author.entity';
import { ReviewPlaceEntity } from './review-place.entity';
import { ReviewModel } from '@libs/core/review/model/review.model';

/**
 * 리뷰 엔티티 클래스
 *
 * @author 강정연
 */
export class ReviewEntity {
  /**
   * 리뷰 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 리뷰 내용
   *
   * @example '너무 맛있어요!'
   */
  public content: string;

  /**
   * 생성 시간
   *
   * @example '2024-03-11T12:34:56.789Z'
   */
  public createdAt: Date;

  /**
   * 삭제 시간
   *
   * @example '2024-03-15T11:04:56.099Z'
   */
  public deletedAt: Date | null;

  /**
   * 이미지 경로 리스트
   *
   * @example ['/review/3b54e245-4f4d-41a0-9c1b-2f5e2f473b38-20250719.jpg', '/review/f994f6ad-c42f-4c29-86db-d391fe450b1f-20250719.jpg'
']
   */
  public imagePathList: string[];

  /**
   * 키워드 리스트
   */
  public keywordList: KeywordEntity[];

  /**
   * 리뷰 작성자 정보
   */
  public author: ReviewAuthorEntity;

  /**
   * 리뷰 장소 정보
   */
  public place: ReviewPlaceEntity;

  /**
   * ReviewEntity 객체를 생성하는 생성자
   */
  constructor(data: ReviewEntity) {
    Object.assign(this, data);
  }

  /**
   * `ReviewEntity`로 변환함
   */
  public static fromModel(model: ReviewModel): ReviewEntity {
    return new ReviewEntity({
      idx: model.idx,
      content: model.content,
      createdAt: model.createdAt,
      deletedAt: model.deletedAt,
      imagePathList: model.imagePathList,
      keywordList: model.keywordList.map(KeywordEntity.fromModel),
      author: ReviewAuthorEntity.fromModel(model.author),
      place: ReviewPlaceEntity.fromModel(model.place),
    });
  }
}
