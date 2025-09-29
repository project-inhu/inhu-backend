import { CreateBlogReviewInput } from '@libs/core/blog-review/inputs/create-blog-review.input';
import { PartialType, PickType } from '@nestjs/swagger';

export class UpdateBlogReviewInput extends PartialType(
  PickType(CreateBlogReviewInput, [
    'title',
    'authorName',
    'authorProfileImagePath',
    'blogName',
    'contents',
    'description',
    'thumbnailImagePath',
    'url',
  ] as const),
) {}
