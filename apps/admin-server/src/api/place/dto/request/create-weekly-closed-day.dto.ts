import { PlaceWeeklyClosedDayEntity } from '@admin/api/place/entity/place-weekly-closed-day.entity';
import { PickType } from '@nestjs/swagger';

export class CreateWeeklyClosedDayDto extends PickType(
  PlaceWeeklyClosedDayEntity,
  ['date', 'type'],
) {}
