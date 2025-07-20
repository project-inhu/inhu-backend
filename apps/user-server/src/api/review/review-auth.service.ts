import { ReviewModel } from '@libs/core/review/model/review.model';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetAllReviewDto } from '@user/api/review/dto/request/get-all-review.dto';
import { LoginUser } from '@user/common/types/LoginUser';

@Injectable()
export class ReviewAuthService {
  constructor() {}

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

  public checkGetReviewByIdxPermission(
    reviewModel: ReviewModel,
    loginUser: LoginUser,
  ) {
    if (reviewModel.author.idx !== loginUser.idx) {
      throw new ForbiddenException('You can only access your own reviews');
    }
  }
}
