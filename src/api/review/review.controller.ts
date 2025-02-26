import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetReviewsByPlaceIdxDto } from './dto/get-reviews-by-place-idx.dto';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get(':placeIdx')
  async getReviewsByPlaceIdx(
    @Param('placeIdx') getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto,
  ) {
    return this.reviewService.getReviewsByPlaceIdx(getReviewsByPlaceIdxDto);
  }

  @Post(':placeIdx')
  async createReview(
    @Param('placeIdx') getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto,
  ) {}
}
