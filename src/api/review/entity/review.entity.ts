import { ReviewQueryResult } from '../interfaces/review-query-result.interface';

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

  constructor(data: ReviewEntity) {
    Object.assign(this, data);
  }

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
