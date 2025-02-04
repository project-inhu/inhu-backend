import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetReviewsByPlaceIdDto, ReviewsByPlaceIdResponseDto } from './review.dto';

@Controller('review')
export class ReviewController {
    constructor(private reviewService: ReviewService) { };

    // query? param? req?
    @Get()
    async getReviewsByPlaceId(
        @Query() getReviewsByPlaceIdDto: GetReviewsByPlaceIdDto
    ): Promise<ReviewsByPlaceIdResponseDto> {
        return this.reviewService.getReviewsByPlaceId(getReviewsByPlaceIdDto);
    }
}
