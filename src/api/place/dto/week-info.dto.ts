import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class WeekInfoDto {
  @ApiProperty({ example: '2024-02-23T12:34:56.789Z' })
  @IsDate()
  startAt: Date | null;

  @ApiProperty({ example: '2024-02-23T12:34:56.789Z' })
  @IsDate()
  endAt: Date | null;
}
