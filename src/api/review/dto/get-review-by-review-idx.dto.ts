import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class getReviewByReviewIdxDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  reviewIdx: number;
}
