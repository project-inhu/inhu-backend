import { BlogReviewCoreRepository } from '@libs/core/blog-review/blog-review-core.repository';
import { CreateBlogReviewInput } from '@libs/core/blog-review/inputs/create-blog-review.input';
import { GetBlogReviewAllInput } from '@libs/core/blog-review/inputs/get-blog-review-all.input';
import { UpdateBlogReviewInput } from '@libs/core/blog-review/inputs/update-blog-review.input';
import { BlogReviewOverviewModel } from '@libs/core/blog-review/model/blog-review-overview.model';
import { BlogReviewModel } from '@libs/core/blog-review/model/blog-review.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogReviewCoreService {
  constructor(
    private readonly blogReviewCoreRepository: BlogReviewCoreRepository,
  ) {}

  public async getBlogReviewByIdx(
    idx: number,
  ): Promise<BlogReviewModel | null> {
    const blogReview =
      await this.blogReviewCoreRepository.selectBlogReviewByIdx(idx);

    return blogReview && BlogReviewModel.fromPrisma(blogReview);
  }

  public async getBlogReviewByUrl(
    url: string,
  ): Promise<BlogReviewModel | null> {
    const blogReview =
      await this.blogReviewCoreRepository.selectBlogReviewByUrl(url);

    return blogReview && BlogReviewModel.fromPrisma(blogReview);
  }

  public async getBlogReviewAll(
    input: GetBlogReviewAllInput,
  ): Promise<BlogReviewOverviewModel[]> {
    return (await this.blogReviewCoreRepository.selectBlogReviewAll(input)).map(
      BlogReviewOverviewModel.fromPrisma,
    );
  }

  public async createBlogReview(
    placeIdx: number,
    input: CreateBlogReviewInput,
  ): Promise<BlogReviewModel> {
    return BlogReviewModel.fromPrisma(
      await this.blogReviewCoreRepository.createBlogReview(placeIdx, input),
    );
  }

  public async updateBlogReviewByIdx(
    idx: number,
    input: UpdateBlogReviewInput,
  ): Promise<void> {
    return await this.blogReviewCoreRepository.updateBlogReviewByIdx(
      idx,
      input,
    );
  }

  public async deleteBlogReviewByIdx(idx: number): Promise<void> {
    return await this.blogReviewCoreRepository.softDeleteBlogReviewByIdx(idx);
  }
}
