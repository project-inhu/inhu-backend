import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { ReviewEntity } from '../entity/review.entity';
import { Type } from 'class-transformer';

export class GetReviewsByPlaceIdxResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewEntity)
  @IsNotEmpty()
  reviews: ReviewEntity[];
}
