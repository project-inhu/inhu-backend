import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewByPlaceIdxDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  placeIdx: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(400)
  content: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  reviewImages: string[];

  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @ArrayMaxSize(5)
  @Min(1, { each: true })
  @Transform(({ value }) => [...new Set(value)])
  keywordIdxList: number[];
}
