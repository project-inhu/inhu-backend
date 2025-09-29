import { BlogReviewService } from '@admin/api/blog-review/blog-review.service';
import { CreateBlogReviewViaLinkDto } from '@admin/api/blog-review/dto/request/create-blog-review-via-link.dto';
import { BlogReviewEntity } from '@admin/api/blog-review/entity/blog-review.entity';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Blog Review')
export class BlogReviewController {
  constructor(private readonly blogReviewService: BlogReviewService) {}

  @Post('/place/:placeIdx/blog-review/naver-blog')
  @Exception(400, 'invalid place idx')
  @Exception(404, 'place not found')
  @Exception(409, 'already existing blog review url')
  @AdminAuth()
  public async createBlogReviewViaNaverBlog(
    @Body() dto: CreateBlogReviewViaLinkDto,
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
  ): Promise<BlogReviewEntity> {
    return await this.blogReviewService.createBlogReviewViaNaverBlogLink(
      placeIdx,
      dto.url,
    );
  }
}
