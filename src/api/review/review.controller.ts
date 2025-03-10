import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewByPlaceIdxDto } from './dto/create-review-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { GetReviewsByPlaceIdxResponseDto } from './dto/get-reviews-by-place-idx-response.dto';
import { CreateReviewByPlaceIdxResponseDto } from './dto/create-review-by-place-idx-response.dto';

@Controller('')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  /**
   * 특정 장소에 대한 리뷰 목록 조회
   *
   * @author 강정연
   */
  // @UseGuards(AuthGuard)
  @Get('place/:placeIdx/reviews')
  async getReviewsByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
  ): Promise<GetReviewsByPlaceIdxResponseDto | null> {
    const reviews = await this.reviewService.getReviewsByPlaceIdx(placeIdx);
    return { reviews };
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
  ): Promise<CreateReviewByPlaceIdxResponseDto> {
    const review = await this.reviewService.createReviewByPlaceIdx({
      placeIdx: createReviewByPlaceIdxDto.placeIdx,
      content: createReviewByPlaceIdxDto.content,
      reviewImages: createReviewByPlaceIdxDto.reviewImages,
      keywordIdxList: createReviewByPlaceIdxDto.keywordIdxList,
    });
    return { review };
  }
}
