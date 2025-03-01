import { ApiProperty } from '@nestjs/swagger';
import { PlaceEntity } from '../entity/place.entity';

export class PlaceByPlaceIdxResponseDto {
  @ApiProperty({
    description: '모든 place entity list',
    type: () => PlaceEntity,
  })
  place: PlaceEntity | null;
}
