import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerEntity } from './entity/banner.entity';
import { CreateBannerDto } from './dto/request/create-banner.dto';
import { UpdateBannerDto } from './dto/request/update-banner.dto';
import { UpdateBannerSortOrderDto } from './dto/request/update-banner-sort-order.dto';
import { GetAllBannerDto } from './dto/request/get-all-banner.dto';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller()
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  /**
   * 배너 목록 조회
   */
  @AdminAuth()
  @Exception(400, 'Invalid query parameters')
  @Get('/banner')
  public async getAllBanner(@Query() dto: GetAllBannerDto) {
    return await this.bannerService.getAllBanner(dto);
  }

  /**
   * 배너 단건 조회
   */
  @AdminAuth()
  @Exception(400, 'Invalid banner idx')
  @Exception(404, 'Banner does not exist')
  @Get('/banner/:idx')
  public async getBannerByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<BannerEntity> {
    return await this.bannerService.getBannerByIdx(idx);
  }

  /**
   * 배너 생성
   */
  @AdminAuth()
  @Exception(400, 'Invalid request body')
  @Post('/banner')
  public async createBanner(
    @Body() dto: CreateBannerDto,
  ): Promise<BannerEntity> {
    return await this.bannerService.createBanner(dto);
  }

  /**
   * 배너 수정
   */
  @AdminAuth()
  @Exception(400, 'Invalid banner idx or request body')
  @Exception(404, 'Banner does not exist')
  @Put('/banner/:idx')
  public async updateBanner(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateBannerDto,
  ): Promise<void> {
    return await this.bannerService.updateBannerByIdx(idx, dto);
  }

  /**
   * 배너 활성화
   */
  @AdminAuth()
  @Exception(400, 'Invalid banner idx')
  @Exception(404, 'Banner does not exist')
  @Exception(409, 'Banner already activated')
  @Put('/banner/:idx/activate')
  public async activateBanner(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.bannerService.activateBannerByIdx(idx);
  }

  /**
   * 배너 비활성화
   */
  @AdminAuth()
  @Exception(400, 'Invalid banner idx')
  @Exception(404, 'Banner does not exist')
  @Exception(409, 'Banner already deactivated')
  @Post('/banner/:idx/deactivate')
  public async deactivateBanner(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.bannerService.deactivateBannerByIdx(idx);
  }

  /**
   * 배너 정렬 순서 수정
   */
  @AdminAuth()
  @Exception(400, 'Invalid banner idx or sort order')
  @Exception(404, 'Banner does not exist')
  @Exception(400, 'Inactive banner cannot update sort order')
  @Post('/banner/:idx/sort-order')
  public async updateBannerSortOrder(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateBannerSortOrderDto,
  ): Promise<void> {
    return await this.bannerService.updateBannerSortOrder(idx, dto);
  }

  /**
   * 배너 삭제
   */
  @AdminAuth()
  @Exception(400, 'Invalid banner idx')
  @Exception(404, 'Banner does not exist')
  @Delete('/banner/:idx')
  public async deleteBanner(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.bannerService.deleteBannerByIdx(idx);
  }
}
