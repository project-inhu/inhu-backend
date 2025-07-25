import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Exception } from '@libs/common';
import { AdminAuth } from '@admin/common/decorator/admin-login.decorator';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * 리뷰 삭제하기 API
   *
   * @author 강정연
   */
  @Delete('/review/:reviewIdx')
  @AdminAuth()
  @Exception(400, 'Invalid reviewIdx')
  async deleteReview(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.deleteReviewByIdx(reviewIdx);
  }
}
