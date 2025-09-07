import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { BannerEntity } from './entity/banner.entity';
import { CreateBannerDto } from './dto/request/create-banner.dto';
import { UpdateBannerDto } from './dto/request/update-banner.dto';
import { UpdateBannerSortOrderDto } from './dto/request/update-banner-sort-order.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  /**
   * 배너 자세히보기 Endpoint
   */
  @Get('/:idx')
  @AdminAuth()
  @Exception(400, 'Invalid bannerIdx')
  @Exception(404, 'Banner not found')
  public async getBannerByIdx(
    @Param('idx') idx: number,
  ): Promise<BannerEntity> {
    return await this.bannerService.getBannerByIdx(idx);
  }

  /**
   * 배너 생성하기 Endpoint
   */
  @Post()
  @AdminAuth()
  @Exception(400, 'Invalid request body')
  public async createBanner(
    @Body() dto: CreateBannerDto,
  ): Promise<BannerEntity> {
    return await this.bannerService.createBanner(dto);
  }

  /**
   * 배너 수정하기 Endpoint
   */
  @Put('/:idx')
  @AdminAuth()
  @Exception(400, 'Invalid bannerIdx or request body')
  @Exception(404, 'Banner does not exist')
  public async updateBanner(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateBannerDto,
  ): Promise<void> {
    await this.bannerService.updateBannerByIdx(idx, dto);
  }

  /**
   * 배너 삭제하기 Endpoint
   */
  @Delete('/:idx')
  @AdminAuth()
  @Exception(400, 'Invalid bannerIdx')
  @Exception(404, 'Banner does not exist')
  public async deleteBanner(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.bannerService.deleteBannerByIdx(idx);
  }

  /**
   * 배너 활성화하기 Endpoint
   */
  @Post('/:idx/activate')
  @AdminAuth()
  @Exception(400, 'Invalid bannerIdx')
  @Exception(404, 'Banner does not exist')
  @Exception(409, 'Banner is already activated')
  public async activateBanner(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.bannerService.activateBannerByIdx(idx);
  }

  /**
   * 배너 비활성화하기 Endpoint
   */
  @Post('/:idx/deactivate')
  @Exception(400, 'Invalid bannerIdx')
  @Exception(404, 'Banner does not exist')
  @Exception(409, 'Banner is not activated')
  @AdminAuth()
  public async deactivateBanner(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.bannerService.deactivateBannerByIdx(idx);
  }

  /**
   * 배너 순서 수정
   */
  @AdminAuth()
  @Put('/:idx/sort-order')
  @Exception(400, 'Invalid request body')
  public async updateBannerSortOrder(
    @Body() dto: UpdateBannerSortOrderDto,
  ): Promise<void> {
    return await this.bannerService.updateBannerSortOrder(dto);
  }
}
