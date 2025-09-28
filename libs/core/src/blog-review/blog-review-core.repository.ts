import { CreateBlogReviewInput } from '@libs/core/blog-review/inputs/create-blog-review.input';
import { GetBlogReviewAllInput } from '@libs/core/blog-review/inputs/get-blog-review-all.input';
import { UpdateBlogReviewInput } from '@libs/core/blog-review/inputs/update-blog-review.input';
import { BlogReviewModel } from '@libs/core/blog-review/model/blog-review.model';
import {
  SELECT_BLOG_REVIEW,
  SelectBlogReview,
} from '@libs/core/blog-review/model/prisma-type/select-blog-review';
import {
  SELECT_BLOG_REVIEW_OVERVIEW,
  SelectBlogReviewOverview,
} from '@libs/core/blog-review/model/prisma-type/select-blog-review-overview';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogReviewCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectBlogReviewByIdx(
    idx: number,
  ): Promise<SelectBlogReview | null> {
    return await this.txHost.tx.blogReview.findUnique({
      ...SELECT_BLOG_REVIEW,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectBlogReviewByUrl(
    url: string,
  ): Promise<SelectBlogReview | null> {
    return await this.txHost.tx.blogReview.findFirst({
      ...SELECT_BLOG_REVIEW,
      where: {
        url,
        deletedAt: null,
      },
    });
  }

  public async selectBlogReviewAll({
    skip,
    take,
    placeIdx,
  }: GetBlogReviewAllInput): Promise<SelectBlogReviewOverview[]> {
    return await this.txHost.tx.blogReview.findMany({
      ...SELECT_BLOG_REVIEW_OVERVIEW,
      where: {
        placeIdx,
        deletedAt: null,
      },
      take,
      skip,
    });
  }

  public async createBlogReview(
    placeIdx: number,
    input: CreateBlogReviewInput,
  ): Promise<SelectBlogReview> {
    return await this.txHost.tx.blogReview.create({
      ...SELECT_BLOG_REVIEW,
      data: {
        placeIdx,
        authorName: input.authorName,
        blogName: input.blogName,
        blogType: input.blogType,
        title: input.title,
        uploadedAt: input.uploadedAt,
        url: input.url,
        authorProfileImagePath: input.authorProfileImagePath,
        contents: input.contents,
        thumbnailImagePath: input.thumbnailImagePath,
        description: input.description,
      },
    });
  }

  public async updateBlogReviewByIdx(
    idx: number,
    input: UpdateBlogReviewInput,
  ): Promise<void> {
    await this.txHost.tx.blogReview.update({
      data: {
        authorName: input.authorName,
        blogName: input.blogName,
        title: input.title,
        authorProfileImagePath: input.authorProfileImagePath,
        contents: input.contents,
        thumbnailImagePath: input.thumbnailImagePath,
        description: input.description,
      },
      where: { idx, deletedAt: null },
    });
  }

  public async softDeleteBlogReviewByIdx(idx: number): Promise<void> {
    await this.txHost.tx.blogReview.update({
      data: { deletedAt: new Date() },
      where: { idx, deletedAt: null },
    });
  }
}
