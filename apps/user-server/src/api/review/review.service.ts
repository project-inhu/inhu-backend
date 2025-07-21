import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';
import { ReviewCoreService } from '@libs/core/review/review-core.service';
import { PlaceCoreService, UserCoreService } from '@libs/core';
import { ReviewEntity } from './entity/review.entity';
import { LoginUser } from '@user/common/types/LoginUser';
import { ReviewAuthService } from '@user/api/review/review-auth.service';
import { CreateReviewDto } from '@user/api/review/dto/request/create-review.dto';
import { UpdateReviewDto } from './dto/request/update-review-dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewCoreService: ReviewCoreService,
    private readonly placeCoreService: PlaceCoreService,
    private readonly reviewAuthService: ReviewAuthService,
  ) {}

  public async getAllReview(
    dto: GetAllReviewDto,
    loginUser?: LoginUser,
  ): Promise<{
    reviewList: ReviewEntity[];
    hasNext: boolean;
  }> {
    this.reviewAuthService.checkGetAllReviewPermission(dto, loginUser);

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

  public async createReviewByPlaceIdx(
    placeIdx: number,
    dto: CreateReviewDto,
    loginUser: LoginUser,
  ): Promise<ReviewEntity> {
    const place = await this.placeCoreService.getPlaceByIdx(placeIdx);

    if (!place) {
      throw new NotFoundException('Cannot find place with given idx');
    }

    const reviewModel = await this.reviewCoreService.createReviewByPlaceIdx(
      placeIdx,
      loginUser.idx,
      {
        content: dto.content,
        imagePathList: dto.imagePathList,
        keywordIdxList: dto.keywordIdxList,
      },
    );

    return ReviewEntity.fromModel(reviewModel);
  }

  public async getReviewByIdx(
    idx: number,
    loginUser: LoginUser,
  ): Promise<ReviewEntity> {
    const reviewModel = await this.reviewCoreService.getReviewByIdx(idx);
    if (!reviewModel) {
      throw new NotFoundException('Review not found');
    }

    this.reviewAuthService.checkReviewPermission(reviewModel, loginUser);

    return ReviewEntity.fromModel(reviewModel);
  }

  public async updateReviewByIdx(
    idx: number,
    dto: UpdateReviewDto,
    loginUser: LoginUser,
  ): Promise<void> {
    await this.getReviewByIdx(idx, loginUser);

    await this.reviewCoreService.updateReviewByIdx(idx, dto);
  }
}
