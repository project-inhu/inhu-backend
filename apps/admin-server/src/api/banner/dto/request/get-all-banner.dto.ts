import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsOptional, Min } from 'class-validator';

export class GetAllBannerDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  public page: number;

  /**
   * 정렬 옵션
   * time = 시간순
   *
   * @example 'time'
   * @default 'time'
   */
  @IsOptional()
  @IsIn(['time'])
  public orderBy?: 'time';

  /**
   * 정렬 방향
   *
   * @example 'desc'
   * @default 'desc'
   */
  @IsOptional()
  @IsIn(['desc', 'asc'])
  public order?: 'desc' | 'asc';

  /**
   * 활성화 여부
   *
   * - true: 활성화된 배너만 조회
   * - false: 비활성화된 배너만 조회
   * - undefined: 모든 배너 조회
   */
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  public active?: boolean;
}
