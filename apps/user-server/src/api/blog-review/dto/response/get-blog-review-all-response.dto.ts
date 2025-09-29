import { BlogReviewOverviewEntity } from '@user/api/blog-review/entity/blog-review-overview.entity';

export class GetBlogReviewAllResponseDto {
  hasNext: boolean;
  blogReviewList: BlogReviewOverviewEntity[];
}
