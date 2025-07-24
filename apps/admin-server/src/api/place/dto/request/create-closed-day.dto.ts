import { PlaceClosedDayEntity } from '@admin/api/place/entity/place-closed-day.entity';
import { PickType } from '@nestjs/swagger';

export class CreateClosedDayDto extends PickType(PlaceClosedDayEntity, [
  'day',
  'week',
]) {}
