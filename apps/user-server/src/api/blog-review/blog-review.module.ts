import { BlogReviewCoreModule } from '@libs/core/blog-review/blog-review-core.module';
import { Module } from '@nestjs/common';
import { BlogReviewController } from '@user/api/blog-review/blog-review.controller';
import { BlogReviewService } from '@user/api/blog-review/blog-review.service';

@Module({
  imports: [BlogReviewCoreModule],
  controllers: [BlogReviewController],
  providers: [BlogReviewService],
  exports: [],
})
export class BlogReviewModule {}
