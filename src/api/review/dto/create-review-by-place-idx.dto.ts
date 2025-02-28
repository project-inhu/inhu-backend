import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateReviewByPlaceIdxDto {
  @Type(() => Number)
  @IsInt()
  placeIdx: number;
}
