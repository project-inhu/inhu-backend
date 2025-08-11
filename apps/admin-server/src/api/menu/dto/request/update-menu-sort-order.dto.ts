import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateMenuSortOrderDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  public sortOrder: number;
}
