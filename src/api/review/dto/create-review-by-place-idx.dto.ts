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

/**
 * 특정 장소에 리뷰를 생성할 때 사용하는 DTO
 *
 * @author 강정연
 */
export class CreateReviewByPlaceIdxDto {
  /**
   * 리뷰를 등록할 장소 Idx
   */
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  placeIdx: number;

  /**
   * 리뷰 내용
   * 최소 3자, 최대 400자
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(400)
  @Transform(({ value }) => value.trim())
  content: string;

  /**
   * 리뷰에 포함된 이미지 리스트
   * 최대 5개
   */
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  reviewImages?: string[];

  /**
   * 리뷰에 포함된 키워드 Idx 리스트
   * 중복 제거, 최대 5개
   */
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @ArrayMaxSize(5)
  @Min(1, { each: true })
  @Transform(({ value }) => [...new Set(value)])
  keywordIdxList?: number[];
}
