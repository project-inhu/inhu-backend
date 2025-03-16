import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Trim } from '../common/decorators/trim.decorator';
import { UniqueArray } from '../common/decorators/unique-array.decorator';

/**
 * 특정 장소에 리뷰를 생성할 때 사용하는 DTO
 *
 * @author 강정연
 */
export class UpdateReviewByReviewIdxDto {
  /**
   * 리뷰 내용
   * 최소 3자, 최대 400자]
   *
   * @example '맛이 최고네요.'
   */
  @Trim()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 400)
  content: string;

  /**
   * 리뷰에 포함된 이미지 리스트
   * 최대 5개
   *
   * @example ['images/review/1/20240312/171923.jpg']
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  imagePathList?: string[];

  /**
   * 리뷰에 포함된 키워드 Idx 리스트
   * 중복 제거, 최대 5개
   *
   * @example [2, 3]
   */
  @UniqueArray()
  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  keywordIdxList?: number[];
}
