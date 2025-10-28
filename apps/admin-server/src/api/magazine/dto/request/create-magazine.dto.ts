import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMagazineDto {
  /**
   * 매거진 제목
   *
   * @example "맛집 탐방"
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * 매거진 설명
   *
   * @example "서울에서 꼭 가봐야 할 맛집을 소개합니다."
   */
  @IsOptional()
  @IsString()
  description: string | null;

  /**
   * 매거진 내용
   *
   * @example "이번 주말에 가볼 만한 맛집을 소개합니다."
   */
  @IsString()
  @IsNotEmpty()
  content: string;

  /**
   * 썸네일 이미지 경로
   * @example "/magazine/thumbnail1.jpg"
   */
  @IsOptional()
  @IsString()
  thumbnailImagePath: string | null;

  /**
   * 썸네일 제목 표시 여부
   *
   * @example false
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isTitleVisible: boolean;
}
