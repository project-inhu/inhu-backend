import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';
import { GetAllReviewResponseDto } from './dto/response/get-all-review.response.dto';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { CreateReviewDto } from '@user/api/review/dto/request/create-review.dto';
import { ReviewEntity } from '@user/api/review/entity/review.entity';
import { Exception } from '@libs/common';
import { UpdateReviewDto } from './dto/request/update-review-dto';

@Controller('')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  /**
   * 리뷰 작성 API
   *
   * @author 강정연
   */
  @Post('/place/:placeIdx/review')
  @LoginAuth()
  @Exception(400, 'Invalid placeIdx or request body')
  @Exception(401, 'Token is missing or invalid')
  @Exception(404, 'Place does not exist')
  @Exception(500, 'Transaction failed')
  async createReview(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() dto: CreateReviewDto,
    @User() loginUser: LoginUser,
  ): Promise<ReviewEntity> {
    return await this.reviewService.createReviewByPlaceIdx(
      placeIdx,
      dto,
      loginUser,
    );
  }

  /**
   * 리뷰 목록 가져오기 API
   *
   * @author 강정연
   */
  @Get('/review/all')
  @Exception(400, 'Query parameter type is invalid')
  @Exception(403, 'Permission denied')
  async getAllReview(
    @Query() dto: GetAllReviewDto,
    @User() loginUser?: LoginUser,
  ): Promise<GetAllReviewResponseDto> {
    return await this.reviewService.getAllReview(dto, loginUser);
  }

  /**
   * 리뷰 수정하기 API
   *
   * @author 강정연
   */
  @Patch('/review/:reviewIdx')
  @Exception(400, 'Invalid reviewIdx or request body')
  @Exception(403, 'Permission denied')
  async updateReview(
    @Param('reviewIdx', ParseIntPipe) reviewIdx: number,
    @Body() dto: UpdateReviewDto,
    @User() loginUser: LoginUser,
  ): Promise<void> {
    await this.reviewService.updateReviewByIdx(reviewIdx, dto, loginUser);
  }
}
