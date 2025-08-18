import { PlaceRoadAddressEntity } from '@admin/api/place/entity/place-road-address.entity';
import { PickType } from '@nestjs/swagger';

export class CreateRoadAddressDto extends PickType(PlaceRoadAddressEntity, [
  'name',
  'detail',
  'addressX',
  'addressY',
]) {}
