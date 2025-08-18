import { Query, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlaceService } from './place.service';
import { GetAllPlaceOverviewDto } from './dto/request/get-all-place-overview.dto';
import { User } from '@user/common/decorator/user.decorator';
import { PlaceEntity } from './entity/place.entity';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { GetAllPlaceOverviewResponseDto } from './dto/response/get-all-place-overview-response.dto';
import { GetAllBookmarkedOverviewResponseDto } from '@user/api/place/dto/response/get-all-bookmarked-overview-response.dto';
import { GetAllBookmarkedPlaceOverviewPlaceDto } from '@user/api/place/dto/request/get-all-bookmarked-place-overview.dto';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { LoginUser } from '@user/common/types/LoginUser';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  /**
   * 모든 place 개요 가져오기
   */
  @Get('/all')
  @Exception(400, 'Invalid page number or orderBy')
  async getAllPlaceOverview(
    @Query() dto: GetAllPlaceOverviewDto,
    @User() loginUser?: LoginUser,
  ): Promise<GetAllPlaceOverviewResponseDto> {
    return await this.placeService.getPlaceOverviewAll(dto, loginUser?.idx);
  }

  /**
   * 북마크한 place 가져오기
   */
  @Get('/bookmarked/all')
  @Exception(400, 'Invalid querystring')
  @LoginAuth()
  async getBookmarkedPlaceOverview(
    @Query() dto: GetAllBookmarkedPlaceOverviewPlaceDto,
    @User() loginUser: LoginUser,
  ): Promise<GetAllBookmarkedOverviewResponseDto> {
    return await this.placeService.getBookmarkedPlaceOverview(
      dto,
      loginUser.idx,
    );
  }

  /**
   * 특정 idx의 place 관련 모든 정보 가져오기
   */
  @Get('/:placeIdx')
  @Exception(400, 'Invalid placeIdx')
  @Exception(404, 'Place not found')
  async getPlaceByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @User() loginUser?: LoginUser,
  ): Promise<PlaceEntity> {
    return await this.placeService.getPlaceByIdx(placeIdx, loginUser?.idx);
  }
}
