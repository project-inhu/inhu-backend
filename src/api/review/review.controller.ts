import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewByPlaceIdxDto } from './dto/create-review-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { GetReviewsByPlaceIdxResponseDto } from './dto/get-reviews-by-place-idx-response.dto';
import { CreateReviewByPlaceIdxResponseDto } from './dto/create-review-by-place-idx-response.dto';
import { UpdateReviewByReviewIdxDto } from './dto/update-review-by-review-idx.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UpdateReviewByReviewIdxResponseDto } from './dto/update-review-by-review-idx-response.dto';

@Controller('')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  /**
   * 특정 장소에 대한 리뷰 목록 조회
   *
   * @author 강정연
   */
  @ApiOkResponse({ type: GetReviewsByPlaceIdxResponseDto })
  @UseGuards(AuthGuard)
  @Get('place/:placeIdx/reviews')
  async getReviewsByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
  ): Promise<GetReviewsByPlaceIdxResponseDto> {
    const reviews = await this.reviewService.getReviewsByPlaceIdx(placeIdx);
    return { reviews };
  }

  /**
   * 특정 장소에 대한 리뷰 생성
   *
   * @author 강정연
   */
  @ApiOkResponse({ type: CreateReviewByPlaceIdxResponseDto })
  // @UseGuards(AuthGuard)
  @Post('place/:placeIdx/review')
  async createReviewByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() createReviewByPlaceIdxDto: CreateReviewByPlaceIdxDto,
  ): Promise<CreateReviewByPlaceIdxResponseDto> {
    const review = await this.reviewService.createReviewByPlaceIdx({
      placeIdx,
      content: createReviewByPlaceIdxDto.content,
      imagePathList: createReviewByPlaceIdxDto.imagePathList,
      keywordIdxList: createReviewByPlaceIdxDto.keywordIdxList,
    });
    return { review };
  }

  /**
   * 특정 리뷰 수정
   *
   * @author 강정연
   */
  @ApiOkResponse({ type: UpdateReviewByReviewIdxResponseDto })
  @Patch('review/:reviewIdx')
  async updateReviewByReviewIdx(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
    @Body() updateReviewByReviewIdxDto: UpdateReviewByReviewIdxDto,
  ): Promise<UpdateReviewByReviewIdxResponseDto> {
    const review = await this.reviewService.updateReviewByReviewIdx({
      reviewIdx,
      content: updateReviewByReviewIdxDto.content,
      imagePathList: updateReviewByReviewIdxDto.imagePathList,
      keywordIdxList: updateReviewByReviewIdxDto.keywordIdxList,
    });

    return { review };
  }
}
