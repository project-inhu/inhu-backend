import { BadRequestException, Injectable } from '@nestjs/common';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';
import { ReviewCoreService } from '@libs/core/review/review-core.service';
import { PlaceCoreService, UserCoreService } from '@libs/core';
import { ReviewEntity } from './entity/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewCoreService: ReviewCoreService,
    private readonly placeCoreService: PlaceCoreService,
    private readonly userCoreService: UserCoreService,
  ) {}

  public async getAllReview(dto: GetAllReviewDto): Promise<{
    reviewList: ReviewEntity[];
    hasNext: boolean;
  }> {
    if (dto.placeIdx) await this.placeCoreService.getPlaceByIdx(dto.placeIdx);
    else if (dto.userIdx) await this.userCoreService.getUserByIdx(dto.userIdx);
    else
      throw new BadRequestException(
        'At least one filter condition is required',
      );
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
