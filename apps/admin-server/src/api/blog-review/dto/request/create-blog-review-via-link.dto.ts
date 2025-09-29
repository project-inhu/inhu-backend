import { IsString } from 'class-validator';

export class CreateBlogReviewViaLinkDto {
  @IsString()
  url: string;
}
