import { ReviewModel } from '@libs/core/review/model/review.model';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetAllReviewDto } from '@user/api/review/dto/request/get-all-review.dto';
import { LoginUser } from '@user/common/types/LoginUser';

@Injectable()
export class ReviewAuthService {
  constructor() {}

  /**
   * 리뷰 목록 조회 권한을 검사함
   * - placeIdx 또는 userIdx 필터가 반드시 하나 이상 존재해야 함
   * - userIdx로 필터링하는 경우, 반드시 본인의 userIdx여야 함
   */
  public checkGetAllReviewPermission(
    dto: GetAllReviewDto,
    loginUser?: LoginUser,
  ) {
    if (!dto.placeIdx && !dto.userIdx) {
      throw new ForbiddenException(
        'You must filter by either placeIdx or userIdx',
      );
    }
    if (dto.userIdx && dto.userIdx !== loginUser?.idx) {
      throw new ForbiddenException('You can only filter your own reviews');
    }

    return;
  }

  /**
   * 특정 리뷰에 대한 권한을 검사
   * - 리뷰 작성자 본인인지 검사
   */
  public checkReviewPermission(reviewModel: ReviewModel, loginUser: LoginUser) {
    if (reviewModel.author.idx !== loginUser.idx) {
      throw new ForbiddenException('You can only access your own reviews');
    }
  }
}
