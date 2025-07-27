import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Exception } from '@libs/common';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetAllReviewResponseDto } from './dto/response/get-all-review.reponse.dto';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';

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
  @Exception(404, 'Place does not exist')
  async deleteReview(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.deleteReviewByIdx(reviewIdx);
  }

  /**
   * 리뷰 목록 가져오기 API
   *
   * @author 강정연
   */
  @Get('/review/all')
  @AdminAuth()
  @Exception(400, 'Query parameter type is invalid')
  @Exception(403, 'Permission denied')
  async getAllReview(
    @Query() dto: GetAllReviewDto,
  ): Promise<GetAllReviewResponseDto> {
    return await this.reviewService.getAllReview(dto);
  }
}
