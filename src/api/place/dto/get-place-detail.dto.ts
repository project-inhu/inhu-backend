import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetPlaceByPlaceIdxDto {
  @ApiProperty({ description: 'place idx number', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idx: number;
}
