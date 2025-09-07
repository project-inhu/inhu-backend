import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
  /**
   * 배너 이름
   * @example "여름 프로모션"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * 배너 이미지 경로
   * @example "/banner/summer-promo.jpg"
   */
  @IsString()
  @IsNotEmpty()
  imagePath: string;

  /**
   * 배너 링크
   * @example "https://example.com/summer-promo"
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  link: string | null = null;

  /**
   * 배너 노출 시작일
   * @example "2024-06-01"
   */
  @IsString()
  @IsKoreanDate()
  @IsNotEmpty()
  startAt: string;

  /**
   * 배너 노출 종료일
   * @example "2024-06-30"
   */
  @IsOptional()
  @IsString()
  @IsKoreanDate()
  @IsNotEmpty()
  endAt: string | null = null;
}
