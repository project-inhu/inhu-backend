import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class GetAllMenuDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  public page: number;
}
