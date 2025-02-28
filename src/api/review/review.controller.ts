import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetReviewsByPlaceIdxDto } from './dto/get-reviews-by-place-idx.dto';
import { CreateReviewByPlaceIdxDto } from './dto/create-review-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';

@Controller('places')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(AuthGuard)
  @Get(':placeIdx/reviews')
  async getReviewsByPlaceIdx(
    @Param() getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto,
  ): Promise<ReviewEntity[]> {
    return this.reviewService.getReviewsByPlaceIdx(getReviewsByPlaceIdxDto);
  }

  @UseGuards(AuthGuard)
  @Post('review')
  async createReviewByPlaceIdx(
    @Body() createReviewByPlaceIdxDto: CreateReviewByPlaceIdxDto,
  ) {
    return this.reviewService.createReviewByPlaceIdx(createReviewByPlaceIdxDto);
  }
}
