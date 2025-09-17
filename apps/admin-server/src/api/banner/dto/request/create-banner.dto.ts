import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateBannerDto {
  /**
   * 배너 이름
   * @example "여름 프로모션"
   */
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  public name: string;

  /**
   * 배너 이미지 경로
   * @example "/banner/summer-promo.jpg"
   */
  @IsString()
  @IsNotEmpty()
  public imagePath: string;

  /**
   * 배너 링크
   * @example "https://example.com/summer-promo"
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public link: string | null = null;
}
