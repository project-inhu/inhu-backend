import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetReviewsByPlaceIdxDto {
  @Type(() => Number)
  @IsInt()
  placeIdx: number;
}
