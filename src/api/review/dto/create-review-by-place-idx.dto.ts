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
   * 리뷰 내용
   * 최소 3자, 최대 400자
   */
  @ApiProperty({
    description: 'review content (최소 3자, 최대 400자',
    example: '정말 맛있어요.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 400)
  @Transform(({ value }) => value.trim())
  content: string;

  /**
   * 리뷰에 포함된 이미지 리스트
   * 최대 5개
   */
  @ApiPropertyOptional({
    description: 'review 사진 path list (최대 5개)',
    example: ['1234.jpg', '5678.jpg'],
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
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @ArrayMaxSize(5)
  @Min(1, { each: true })
  @Transform(({ value }) => [...new Set(value)])
  keywordIdxList?: number[];
}
