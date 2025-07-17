import { PickType } from '@nestjs/swagger';
import { ReviewSelectField } from '../type/review-select-field';
import { UserInfoEntity } from '@user/api/user/entity/user-info.entity';
import { PlaceOverviewEntity } from '@user/api/place/entity/place-overview.entity';
import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';

class ReviewAuthorEntity extends PickType(UserInfoEntity, [
  'idx',
  'nickname',
  'profileImagePath',
]) {}

class ReviewPlaceEntity extends PickType(PlaceOverviewEntity, [
  'idx',
  'name',
  'addressName',
  'detailAddress',
]) {}

class ReviewKeywordEntity extends PickType(KeywordEntity, ['idx', 'content']) {}

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
   * review 이미지 path list
   *
   * @example ['https://inhu.s3.ap-northeast-2.amazonaws.com/review/1/20240704_235922_5fd1a39a.jpg', 'https://inhu.s3.ap-northeast-2.amazonaws.com/review/1/20240704_235924_5321a39c.jpg']
   */
  imagePathList: string[];

  /**
   * review keyword 목록
   */
  keywordList: ReviewKeywordEntity[];

  /**
   * review 작성자 정보
   */
  author: ReviewAuthorEntity;

  /**
   * review 등록한 place 정보
   */
  place: ReviewPlaceEntity;

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
      content: review.content,
      createdAt: review.createdAt,
      imagePathList: review.reviewImageList.map(({ path }) => path),
      keywordList: review.reviewKeywordMappingList.map(({ keyword }) => ({
        idx: keyword.idx,
        content: keyword.content,
      })),
      author: {
        idx: review.userIdx,
        nickname: review.user.nickname,
        profileImagePath: review.user.profileImagePath,
      },
      place: {
        idx: review.placeIdx,
        name: review.place.name,
        addressName: review.place.roadAddress.addressName,
        detailAddress: review.place.roadAddress.detailAddress,
      },
    });
  }
}
