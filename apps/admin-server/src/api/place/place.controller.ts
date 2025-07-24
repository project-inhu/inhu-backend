import { PlaceService } from '@admin/api/place/place.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('place')
@ApiTags('Place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}
}
