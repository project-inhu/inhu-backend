import { ReviewCoreService } from '@libs/core/review/review-core.service';
import { Injectable } from '@nestjs/common';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';
import { ReviewEntity } from './entity/review.entity';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewCoreService: ReviewCoreService) {}

  public async getAllReview(dto: GetAllReviewDto): Promise<{
    reviewList: ReviewEntity[];
    hasNext: boolean;
  }> {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (dto.page - 1) * pageSize;

    const reviewModelList = await this.reviewCoreService.getAllReview({
      take,
      skip,
      ...dto,
    });

    return {
      reviewList: reviewModelList
        .slice(0, pageSize)
        .map((review) => ReviewEntity.fromModel(review)),
      hasNext: reviewModelList.length > pageSize,
    };
  }
}
