import { Controller, Query } from '@nestjs/common';
import { PickedPlaceService } from './picked-place.service';
import { GetAllPickedPlaceDto } from './dto/get-all-picked-place.dto';
import { User } from 'src/common/decorator/user.decorator';

@Controller('picked-place')
export class PickedPlaceController {
  constructor(private pickedPlaceService: PickedPlaceService) {}

  async getAllPickedPlace(
    @Query() getAllPickedPlaceDto: GetAllPickedPlaceDto,
    @User('idx') userIdx?: number,
  ) {
    return await this.pickedPlaceService.getAllPickedPlace(
      getAllPickedPlaceDto.page,
      userIdx,
    );
  }
}
