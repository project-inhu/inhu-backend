import { BlogReviewService } from '@admin/api/blog-review/blog-review.service';
import { CreateBlogReviewViaLinkDto } from '@admin/api/blog-review/dto/request/create-blog-review-via-link.dto';
import { GetBlogReviewAllDto } from '@admin/api/blog-review/dto/request/get-blog-review-all.dto';
import { GetBlogReviewAllResponseDto } from '@admin/api/blog-review/dto/response/get-blog-review-all-response.dto';
import { BlogReviewEntity } from '@admin/api/blog-review/entity/blog-review.entity';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Blog Review')
export class BlogReviewController {
  constructor(private readonly blogReviewService: BlogReviewService) {}

  /**
   * url로 블로그 리뷰 등록하기
   */
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

  /**
   * 블로그 리뷰 목록보기
   */
  @Get('/place/:placeIdx/blog-review')
  @Exception(400, 'invalid querystring')
  @AdminAuth()
  public async getBlogReviewAll(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Query() dto: GetBlogReviewAllDto,
  ): Promise<GetBlogReviewAllResponseDto> {
    return await this.blogReviewService.getBlogReviewAll(placeIdx, dto);
  }

  /**
   * 블로그 리뷰 삭제하기
   */
  @Delete('/blog-review/:blogReviewIdx')
  @Exception(400, 'invalid querystring')
  @Exception(404, 'blog review not found')
  @AdminAuth()
  public async deleteBlogReviewByIdx(
    @Param('blogReviewIdx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.blogReviewService.deleteBlogReviewByIdx(idx);
  }

  /**
   * 블로그 리뷰 자세히보기
   */
  @Get('/blog-review/:blogReviewIdx')
  @Exception(400, 'invalid path parameter')
  @Exception(404, 'blog review not found')
  @AdminAuth()
  public async getBlogReviewByIdx(
    @Param('blogReviewIdx', ParseIntPipe) idx: number,
  ) {
    return await this.blogReviewService.getBlogReviewByIdx(idx);
  }

  /**
   * 블로그 리뷰 url로 자세히보기
   */
  @Get('/blog-review/url/:url')
  @Exception(400, 'invalid path parameter')
  @Exception(404, 'blog review not found')
  @AdminAuth()
  public async getBlogReviewByUrl(@Param('url') url: string) {
    return await this.blogReviewService.getBlogReviewByUrl(url);
  }
}
