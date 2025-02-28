import { ApiProperty } from '@nestjs/swagger';

export class WeekInfoDto {
  @ApiProperty({ example: '2024-02-23T12:34:56.789Z' })
  startAt: Date | null;

  @ApiProperty({ example: '2024-02-23T12:34:56.789Z' })
  endAt: Date | null;
}
