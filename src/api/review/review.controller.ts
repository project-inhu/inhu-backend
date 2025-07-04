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
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './entity/review.entity';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/common/decorator/user.decorator';
import { LoginAuth } from 'src/auth/common/decorators/login-auth.decorator';
import { Exception } from 'src/common/decorator/exception.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  /**
   * 특정 장소에 대한 리뷰 목록 조회
   *
   * @author 강정연
   */
  @Exception(400, 'PlaceIdx must be a number')
  @Exception(404, 'PlaceIdx does not exist')
  @Exception(500, 'Internal Server Error')
  @Get('/place/:placeIdx/review/all')
  async getAllReviewByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewService.getAllReviewByPlaceIdx(placeIdx);
  }

  /**
   * 특정 장소에 대한 리뷰 생성
   *
   * @author 강정연
   */
  @ApiBearerAuth()
  @LoginAuth
  @Exception(400, 'PlaceIdx must be a number or Invalid request body')
  @Exception(404, 'Place does not exist or keyword or user does not exist')
  @Exception(500, 'Internal Server Error')
  @Post('/place/:placeIdx/review')
  async createReviewByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() createReviewDto: CreateReviewDto,
    @User('idx') userIdx: number,
  ): Promise<ReviewEntity> {
    return await this.reviewService.createReviewByPlaceIdx({
      placeIdx,
      userIdx,
      content: createReviewDto.content,
      imagePathList: createReviewDto.imagePathList,
      keywordIdxList: createReviewDto.keywordIdxList,
    });
  }

  /**
   * 특정 리뷰 수정
   *
   * @author 강정연
   */
  @ApiBearerAuth()
  @LoginAuth
  @Exception(400, 'ReviewIdx must be a number or Invalid request')
  @Exception(403, 'You are not allowed to update this review')
  @Exception(404, 'Review or user does not exist')
  @Exception(500, 'Internal Server Error')
  @Patch('/review/:reviewIdx')
  async updateReviewByReviewIdx(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @User('idx') userIdx: number,
  ): Promise<ReviewEntity> {
    return await this.reviewService.updateReviewByReviewIdx({
      reviewIdx,
      userIdx,
      content: updateReviewDto.content,
      imagePathList: updateReviewDto.imagePathList,
      keywordIdxList: updateReviewDto.keywordIdxList,
    });
  }

  /**
   * 특정 리뷰 삭제
   *
   * @author 강정연
   */
  @ApiBearerAuth()
  @LoginAuth
  @Exception(400, 'ReviewIdx must be a number')
  @Exception(403, 'You are not allowed to delete this review')
  @Exception(404, 'Review or user does not exist')
  @Exception(500, 'Internal Server Error')
  @Delete('/review/:reviewIdx')
  async deleteReviewByReviewIdx(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
    @User('idx') userIdx: number,
  ): Promise<void> {
    await this.reviewService.deleteReviewByReviewIdx(reviewIdx, userIdx);
  }

  /**
   * 특정 사용자가 작성한 리뷰 목록 조회
   *
   * @author 강정연
   */
  @ApiBearerAuth()
  @LoginAuth
  @Exception(404, 'User does not exist')
  @Exception(500, 'Internal Server Error')
  @Get('/my/review/all')
  async getAllReviewByUserIdx(
    @User('idx') userIdx: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewService.getAllReviewByUserIdx(userIdx);
  }
}
