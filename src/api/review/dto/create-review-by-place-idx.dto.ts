import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewByPlaceIdxDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  placeIdx: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  keywordIdxs: number[];
}
