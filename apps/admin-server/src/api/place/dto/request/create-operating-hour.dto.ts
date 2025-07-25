import { PlaceOperatingHourEntity } from '@admin/api/place/entity/place-operating-hour.entity';
import { PickType } from '@nestjs/swagger';

export class CreateOperatingHourDto extends PickType(PlaceOperatingHourEntity, [
  'endAt',
  'startAt',
  'day',
]) {}
