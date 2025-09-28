import { NaverBlogService } from '@libs/common/modules/naver-blog/naver-blog.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [NaverBlogService],
  exports: [NaverBlogService],
})
export class NaverBlogModule {}
