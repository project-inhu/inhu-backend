import { ApiProperty } from '@nestjs/swagger';
import { PlaceOverviewEntity } from '../entity/place-overview.entity';

export class AllPlaceOverviewResponseDto {
  @ApiProperty({ description: '모든 place entity list' })
  placeOverviewList: PlaceOverviewEntity[];
}
