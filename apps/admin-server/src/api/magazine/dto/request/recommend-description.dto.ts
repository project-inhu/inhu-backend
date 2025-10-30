import { IsNotEmpty, IsString } from 'class-validator';

export class RecommendDescriptionDto {
  /**
   * 매거진 제목
   *
   * @example "맛집 탐방"
   */
  @IsString()
  @IsNotEmpty()
  title: string;

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
  @IsString()
  @IsNotEmpty()
  thumbnailImagePath: string;
}
