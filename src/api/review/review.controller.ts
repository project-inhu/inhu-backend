import {
  Body,
  Controller,
  Delete,
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
import { UpdateReviewByReviewIdxDto } from './dto/update-review-by-review-idx.dto';
import { User } from 'src/common/decorator/user.decorator';

@Controller('')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  /**
   * 특정 장소에 대한 리뷰 목록 조회
   *
   * @author 강정연
   */
  @UseGuards(AuthGuard)
  @Get('place/:placeIdx/reviewList')
  async getReviewListByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
  ): Promise<ReviewEntity[]> {
    const reviewList =
      await this.reviewService.getReviewListByPlaceIdx(placeIdx);
    return reviewList;
  }

  /**
   * 특정 장소에 대한 리뷰 생성
   *
   * @author 강정연
   */
  @UseGuards(AuthGuard)
  @Post('place/:placeIdx/review')
  async createReviewByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() createReviewByPlaceIdxDto: CreateReviewByPlaceIdxDto,
  ): Promise<ReviewEntity> {
    const review = await this.reviewService.createReviewByPlaceIdx({
      placeIdx,
      content: createReviewByPlaceIdxDto.content,
      imagePathList: createReviewByPlaceIdxDto.imagePathList,
      keywordIdxList: createReviewByPlaceIdxDto.keywordIdxList,
    });
    return review;
  }

  /**
   * 특정 리뷰 수정
   *
   * @author 강정연
   */
  @UseGuards(AuthGuard)
  @Patch('review/:reviewIdx')
  async updateReviewByReviewIdx(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
    @Body() updateReviewByReviewIdxDto: UpdateReviewByReviewIdxDto,
    @User() user: AccessTokenPayload,
  ): Promise<ReviewEntity> {
    const review = await this.reviewService.updateReviewByReviewIdx({
      reviewIdx,
      userIdx: user.idx,
      content: updateReviewByReviewIdxDto.content,
      imagePathList: updateReviewByReviewIdxDto.imagePathList,
      keywordIdxList: updateReviewByReviewIdxDto.keywordIdxList,
    });

    return review;
  }

  /**
   * 특정 리뷰 삭제
   *
   * @author 강정연
   */
  @Delete('review/:reviewIdx')
  async deleteReviewByReviewIdx(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
    @User() user: AccessTokenPayload,
  ): Promise<void> {
    const review = await this.reviewService.deleteReviewByReviewIdx(
      reviewIdx,
      user.idx,
    );

    return review;
  }
}
