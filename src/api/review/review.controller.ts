import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetReviewsByPlaceIdxDto } from './dto/get-reviews-by-place-idx.dto';

@Controller('places')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get(':placeIdx/reviews')
  async getReviewsByPlaceIdx(
    @Param('placeIdx') getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto,
  ) {
    return this.reviewService.getReviewsByPlaceIdx(getReviewsByPlaceIdxDto);
  }

  @Post(':placeIdx/review')
  async createReview(
    @Param('placeIdx') getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto,
  ) {}
}
