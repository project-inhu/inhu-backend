import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';
import { GetAllReviewResponseDto } from './dto/response/get-all-review.response.dto';

@Controller('')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get('/review/all')
  async getAllReview(
    @Query() dto: GetAllReviewDto,
  ): Promise<GetAllReviewResponseDto> {
    return this.reviewService.getAllReview(dto);
  }
}
