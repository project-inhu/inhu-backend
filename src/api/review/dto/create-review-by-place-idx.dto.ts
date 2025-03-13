import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

/**
 * 특정 장소에 리뷰를 생성할 때 사용하는 DTO
 *
 * @author 강정연
 */
export class CreateReviewByPlaceIdxDto {
  /**
   * 리뷰 내용
   * 최소 3자, 최대 400자
   */
  @ApiProperty({
    description: 'review content (최소 3자, 최대 400자)',
    example: '정말 맛있어요.',
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @Length(3, 400)
  content: string;

  /**
   * 리뷰에 포함된 이미지 리스트
   * 최대 5개
   */
  @ApiPropertyOptional({
    description: 'review 사진 path list (최대 5개)',
    example: [
      'images/review/1/20240312/171923.jpg',
      'images/review/1/20240312/17234.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  imagePathList?: string[];

  /**
   * 리뷰에 포함된 키워드 Idx 리스트
   * 중복 제거, 최대 5개
   */
  @ApiPropertyOptional({
    description: 'review keyword idx list (최대 5개)',
    example: [1, 3],
  })
  @Transform(({ value }) => [...new Set(value)])
  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  @Min(1, { each: true })
  keywordIdxList?: number[];
}
