import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Exception } from '@libs/common';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';
import { GetAllReviewResponseDto } from './dto/response/get-all-review.response.dto';
import { AdminAuth } from '@admin/common/decorator/admin-login.decorator';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/review/all')
  @Exception(400, 'Query parameter type is invalid')
  @AdminAuth()
  public async getAllReview(
    @Query() dto: GetAllReviewDto,
  ): Promise<GetAllReviewResponseDto> {
    return this.reviewService.getAllReview(dto);
  }
}
