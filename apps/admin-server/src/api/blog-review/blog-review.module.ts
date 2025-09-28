import { BlogReviewController } from '@admin/api/blog-review/blog-review.controller';
import { BlogReviewService } from '@admin/api/blog-review/blog-review.service';
import { BlogReviewCoreModule } from '@libs/core/blog-review/blog-review-core.module';
import { NaverBlogModule } from '@libs/common/modules/naver-blog/naver-blog.module';
import { Module } from '@nestjs/common';
import { S3Module } from '@libs/common/modules/s3/s3.module';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';

@Module({
  imports: [BlogReviewCoreModule, NaverBlogModule, S3Module, PlaceCoreModule],
  controllers: [BlogReviewController],
  providers: [BlogReviewService],
  exports: [],
})
export class BlogReviewModule {}
