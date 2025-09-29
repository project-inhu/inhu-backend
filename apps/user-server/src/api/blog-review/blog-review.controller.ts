import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogReviewService } from '@user/api/blog-review/blog-review.service';
import { GetBlogReviewAllDto } from '@user/api/blog-review/dto/request/get-blog-review-all.dto';
import { GetBlogReviewAllResponseDto } from '@user/api/blog-review/dto/response/get-blog-review-all-response.dto';

@Controller()
@ApiTags('Blog Review')
export class BlogReviewController {
  constructor(private readonly blogReviewService: BlogReviewService) {}

  @Get('/place/:placeIdx/blog-review')
  public async getBlogReviewAll(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Query() dto: GetBlogReviewAllDto,
  ): Promise<GetBlogReviewAllResponseDto> {
    console.log(dto);
    return await this.blogReviewService.getBlogReviewAll(placeIdx, dto);
  }
}
