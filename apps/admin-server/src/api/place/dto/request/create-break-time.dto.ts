import { PlaceBreakTimeEntity } from '@admin/api/place/entity/place-break-time.entity';
import { PickType } from '@nestjs/swagger';

export class CreateBreakTimeDto extends PickType(PlaceBreakTimeEntity, [
  'startAt',
  'endAt',
  'day',
]) {}
