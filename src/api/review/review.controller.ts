import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewByPlaceIdxDto } from './dto/create-review-by-place-idx.dto';
import { ReviewEntity } from './entity/review.entity';
import { UpdateReviewByReviewIdxDto } from './dto/update-review-by-review-idx.dto';
import { User } from 'src/common/decorator/user.decorator';
import { LoginAuth } from 'src/auth/common/decorators/login-auth.decorator';
import { Execption } from 'src/common/decorator/exception.decorator';

@Controller('')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  /**
   * 특정 장소에 대한 리뷰 목록 조회
   *
   * @author 강정연
   */
  @Execption(400, 'PlaceIdx must be a number')
  @Execption(404, 'PlaceIdx does not exist')
  @Execption(500, 'Internal Server Error')
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
  @LoginAuth
  @Execption(400, 'PlaceIdx must be a number')
  @Execption(400, 'Invalid request body')
  @Execption(404, 'Place does not exist')
  @Execption(500, 'Internal Server Error')
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
  @LoginAuth
  @Execption(400, 'ReviewIdx must be a number or Invalid request')
  @Execption(400, 'Invalid request body')
  @Execption(403, 'You are not allowed to update this review')
  @Execption(404, 'Review does not exist')
  @Execption(500, 'Internal Server Error')
  @Patch('review/:reviewIdx')
  async updateReviewByReviewIdx(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
    @Body() updateReviewByReviewIdxDto: UpdateReviewByReviewIdxDto,
    @User('idx') userIdx: number,
  ): Promise<ReviewEntity> {
    const review = await this.reviewService.updateReviewByReviewIdx({
      reviewIdx,
      userIdx,
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
  @LoginAuth
  @Execption(400, 'ReviewIdx must be a number or Invalid request')
  @Execption(403, 'You are not allowed to delete this review')
  @Execption(404, 'Review does not exist')
  @Execption(500, 'Internal Server Error')
  @Delete('review/:reviewIdx')
  async deleteReviewByReviewIdx(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
    @User('idx') userIdx: number,
  ): Promise<void> {
    const review = await this.reviewService.deleteReviewByReviewIdx(
      reviewIdx,
      userIdx,
    );

    return review;
  }
}
