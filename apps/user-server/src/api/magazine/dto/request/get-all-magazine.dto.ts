import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class GetAllMagazineDto {
  /**
   * page number
   *
   * @example 1
   */
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number;
}
