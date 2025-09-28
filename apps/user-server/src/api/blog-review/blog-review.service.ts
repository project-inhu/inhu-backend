import { BlogReviewCoreService } from '@libs/core/blog-review/blog-review-core.service';
import { Injectable } from '@nestjs/common';
import { GetBlogReviewAllDto } from '@user/api/blog-review/dto/request/get-blog-review-all.dto';
import { BlogReviewOverviewEntity } from '@user/api/blog-review/entity/blog-review-overview.entity';

@Injectable()
export class BlogReviewService {
  constructor(private readonly blogReviewCoreService: BlogReviewCoreService) {}

  public async getBlogReviewAll(placeIdx: number, dto: GetBlogReviewAllDto) {
    const blogList = await this.blogReviewCoreService.getBlogReviewAll({
      placeIdx,
      take: 10,
      skip: (dto.page - 1) * 10 + 1,
    });

    return {
      hasNext: !!blogList[10],
      blogReviewList: blogList
        .slice(0, 10)
        .map(BlogReviewOverviewEntity.fromModel),
    };
  }
}
