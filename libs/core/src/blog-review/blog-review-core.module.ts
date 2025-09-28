import { BlogReviewCoreRepository } from '@libs/core/blog-review/blog-review-core.repository';
import { BlogReviewCoreService } from '@libs/core/blog-review/blog-review-core.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [BlogReviewCoreService, BlogReviewCoreRepository],
  exports: [BlogReviewCoreService],
})
export class BlogReviewCoreModule {}
