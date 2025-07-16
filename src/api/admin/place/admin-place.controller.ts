import { Body, Controller, Post } from '@nestjs/common';
import { AdminPlaceService } from './admin-place.service';
import { CreatePlaceDto } from './dto/create-place.dto';

@Controller('')
export class AdminPlaceController {
  constructor(private readonly adminPlaceService: AdminPlaceService) {}
  // controller까지만 만들어서 함수 호출 안됨

  // @Post('/place')
  // async createPlace(@Body() createPlaceDto: CreatePlaceDto) {
  //   return this.adminPlaceService.createPlace(
  //     createPlaceDto.imageList,
  //     createPlaceDto.name,
  //     createPlaceDto.addressName,
  //     createPlaceDto.detailAddress,
  //     createPlaceDto.tel,
  //     createPlaceDto.operatingDayList,
  //     createPlaceDto.menuList,
  //   );
  // }
}
