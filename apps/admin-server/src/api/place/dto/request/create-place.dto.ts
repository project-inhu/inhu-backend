import { CreateBreakTimeDto } from '@admin/api/place/dto/request/create-break-time.dto';
import { CreateClosedDayDto } from '@admin/api/place/dto/request/create-closed-day.dto';
import { CreateOperatingHourDto } from '@admin/api/place/dto/request/create-operating-hour.dto';
import { CreateRoadAddressDto } from '@admin/api/place/dto/request/create-road-address.dto';
import { CreateWeeklyClosedDayDto } from '@admin/api/place/dto/request/create-weekly-closed-day.dto';
import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { PickType } from '@nestjs/swagger';
import { Validate, ValidateNested } from 'class-validator';

export class CreatePlaceDto extends PickType(PlaceEntity, [
  'name',
  'tel',
  'isClosedOnHoliday',
  'imagePathList',
  'type',
]) {
  @ValidateNested()
  public roadAddress: CreateRoadAddressDto;

  @ValidateNested({ each: true })
  public weeklyClosedDayList: CreateWeeklyClosedDayDto[];

  @ValidateNested({ each: true })
  public operatingHourList: CreateOperatingHourDto[];

  @ValidateNested({ each: true })
  public breakTimeList: CreateBreakTimeDto[];

  @ValidateNested({ each: true })
  public closedDayList: CreateClosedDayDto[];
}
