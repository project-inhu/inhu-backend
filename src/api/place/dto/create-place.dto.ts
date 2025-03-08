import { IsArray, IsDecimal, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WeekScheduleDto } from './week-schedule.dto';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsString()
  tel: string;

  @IsString()
  address: string;

  @IsDecimal()
  addressX: string;

  @IsDecimal()
  addressY: string;

  @ValidateNested()
  @Type(() => WeekScheduleDto)
  week: WeekScheduleDto;

  @IsArray()
  @IsString({ each: true })
  placeImageList: string[];
}
