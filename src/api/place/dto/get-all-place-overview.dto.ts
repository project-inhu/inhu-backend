import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetAllPlaceOverviewDto {
  @ApiProperty({ description: 'page number', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ description: 'userIdx number', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userIdx: number;
}
