import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetBlogReviewAllDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;
}
