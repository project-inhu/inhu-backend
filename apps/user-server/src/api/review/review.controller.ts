import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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

@Controller('')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  /**
   * 리뷰 작성 API
   */
  @Post('/place/:placeIdx/review')
  @LoginAuth()
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

  @Get('/review/all')
  async getAllReview(
    @Query() dto: GetAllReviewDto,
    @User() loginUser?: LoginUser,
  ): Promise<GetAllReviewResponseDto> {
    return await this.reviewService.getAllReview(dto, loginUser);
  }
}
