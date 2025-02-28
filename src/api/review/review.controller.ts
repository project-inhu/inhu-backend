import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetReviewsByPlaceIdxDto } from './dto/get-reviews-by-place-idx.dto';
import { CreateReviewByPlaceIdxDto } from './dto/create-review-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';

@Controller('places')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get(':placeIdx/reviews')
  async getReviewsByPlaceIdx(
    @Param() getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto,
  ): Promise<ReviewEntity[]> {
    return this.reviewService.getReviewsByPlaceIdx(getReviewsByPlaceIdxDto);
  }

  @Post(':placeIdx/review')
  async createReviewByPlaceIdx(
    @Param('placeIdx') createReviewByPlaceIdxDto: CreateReviewByPlaceIdxDto,
  ) {}
}
