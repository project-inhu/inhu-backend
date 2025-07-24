import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Exception } from '@libs/common';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/review/all')
  @Exception(400, 'Query parameter type is invalid')
  getAllReview() {
    return this.reviewService.getAllReview();
  }
}
