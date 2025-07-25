import { CreatePlaceDto } from '@admin/api/place/dto/request/create-place.dto';
import { PickType } from '@nestjs/swagger';

export class UpdatePlaceDto extends PickType(CreatePlaceDto, [
  'name',
  'tel',
  'isClosedOnHoliday',
  'imagePathList',
  'type',
  'roadAddress',
  'weeklyClosedDayList',
  'operatingHourList',
  'breakTimeList',
  'closedDayList',
]) {}
