import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetReviewsByPlaceIdxDto } from './dto/get-reviews-by-place-idx.dto';
import { CreateReviewByPlaceIdxDto } from './dto/create-review-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { GetReviewsByPlaceIdxResponseDto } from './dto/get-reviews-by-place-idx-response.dto';

@Controller('')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  /**
   * 특정 장소에 대한 리뷰 목록 조회
   *
   * @author 강정연
   */
  // @UseGuards(AuthGuard)
  @Get('places/:placeIdx/reviews')
  async getReviewsByPlaceIdx(
    @Param() getReviewsByPlaceIdxDto: GetReviewsByPlaceIdxDto,
  ): Promise<GetReviewsByPlaceIdxResponseDto | null> {
    return this.reviewService.getReviewsByPlaceIdx(getReviewsByPlaceIdxDto);
  }

  /**
   * 특정 장소에 대한 리뷰 생성
   *
   * @author 강정연
   */
  // @UseGuards(AuthGuard)
  @Post('review')
  async createReviewByPlaceIdx(
    @Body() createReviewByPlaceIdxDto: CreateReviewByPlaceIdxDto,
  ) {
    return this.reviewService.createReviewByPlaceIdx(createReviewByPlaceIdxDto);
  }
}
