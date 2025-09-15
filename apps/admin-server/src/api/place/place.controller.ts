import { CreatePlaceDto } from '@admin/api/place/dto/request/create-place.dto';
import { GetPlaceOverviewDto } from '@admin/api/place/dto/request/get-place-overview-all.dto';
import { UpdatePlaceDto } from '@admin/api/place/dto/request/update-place.dto';
import { GetPlaceOverviewAllResponseDto } from '@admin/api/place/dto/response/get-place-overview-all-response.dto';
import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { PlaceService } from '@admin/api/place/place.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBiWeeklyClosedDayDto } from './dto/request/create-bi-weekly-closed-day.dto';
import { RunBiWeeklyClosedDayCronJobDto } from './dto/request/run-bi-weekly-closed-day-cron-job.dto';
import { RunBiWeeklyClosedDayCronJobResponseDto } from './dto/response/run-bi-weekly-closed-day-cron-job.response.dto';

@Controller('place')
@ApiTags('Place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly logger: Logger,
  ) {}

  /**
   * 장소 목록 조회 Endpoint
   */
  @Get()
  @Exception(400, 'Invalid place overview request')
  @AdminAuth()
  public async getPlaceOverviewAll(
    @Query() dto: GetPlaceOverviewDto,
  ): Promise<GetPlaceOverviewAllResponseDto> {
    return await this.placeService.getPlaceAll(dto);
  }

  /**
   * 장소 자세히보기 Endpoint
   */
  @Get('/:idx')
  @Exception(400, 'Invalid place idx')
  @Exception(404, 'Place not found')
  @AdminAuth()
  public async getPlaceByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<PlaceEntity> {
    return await this.placeService.getPlaceByIdx(idx);
  }

  /**
   * 장소 생성하기 Endpoint
   */
  @Post()
  @Exception(400, 'Invalid place data')
  @Exception(404, 'Address not found')
  @HttpCode(200)
  @AdminAuth()
  public async createPlace(@Body() dto: CreatePlaceDto): Promise<PlaceEntity> {
    return await this.placeService.createPlace(dto);
  }

  /**
   * 장소 수정하기 Endpoint
   */
  @Put('/:idx')
  @Exception(400, 'Invalid place idx or data')
  @Exception(404, 'Place or address not found')
  @HttpCode(200)
  @AdminAuth()
  public async updatePlace(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdatePlaceDto,
  ): Promise<void> {
    await this.placeService.updatePlaceByIdx(idx, dto);
  }

  /**
   * 장소 삭제하기 Endpoint
   */
  @Delete('/:idx')
  @Exception(400, 'Invalid place idx')
  @Exception(404, 'Place not found or already deleted')
  @HttpCode(200)
  @AdminAuth()
  public async deletedPlaceByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.placeService.deletePlaceByIdx(idx);
  }

  /**
   * 장소 활성화하기 Endpoint
   */
  @Post('/:idx/activate')
  @Exception(400, 'Invalid place idx')
  @Exception(404, 'Place not found')
  @Exception(409, 'Place is already activated')
  @HttpCode(200)
  @AdminAuth()
  public async activatePlaceByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.placeService.activatePlaceByIdx(idx);
  }

  /**
   * 장소 비활성화하기 Endpoint
   */
  @Post('/:idx/deactivate')
  @Exception(400, 'Invalid place idx')
  @Exception(404, 'Place not found')
  @Exception(409, 'Place is not activated')
  @HttpCode(200)
  @AdminAuth()
  public async deactivatePlaceByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.placeService.deactivatePlaceByIdx(idx);
  }

  /**
   * 장소 영구적으로 닫기 Endpoint
   */
  @Post('/:idx/close-permanently')
  @Exception(400, 'Invalid place idx')
  @Exception(404, 'Place not found')
  @Exception(409, 'Place is already permanently closed')
  @HttpCode(200)
  @AdminAuth()
  public async closePermanentlyPlaceByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.placeService.closePermanentlyPlaceByIdx(idx);
  }

  /**
   * 장소 영구적으로 닫기 취소하기
   */
  @Post('/:idx/cancel-close-permanently')
  @Exception(400, 'Invalid place idx')
  @Exception(404, 'Place not found')
  @Exception(409, 'Place is not permanently closed')
  @HttpCode(200)
  @AdminAuth()
  public async cancelClosePermanentlyPlaceByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.placeService.cancelClosePermanentlyPlaceByIdx(idx);
  }

  /**
   * 특정 날짜의 14일 뒤 휴무일 생성 cron job을 수동 실행
   */
  @Post('/cron/bi-weekly-closed-day')
  @Exception(400, 'Invalid date')
  @HttpCode(200)
  @AdminAuth()
  public async runBiWeeklyClosedDayCronJob(
    @Body() dto: RunBiWeeklyClosedDayCronJobDto,
  ): Promise<RunBiWeeklyClosedDayCronJobResponseDto> {
    const result = await this.placeService.createAllBiWeeklyClosedDay(dto.date);
    if (result.failureCount > 0) {
      const failLogDetails = result.errorList
        .map((e) => `  - Place Idx: ${e.placeIdx}, Reason: ${e.errorMessage}`)
        .join('\n');

      const errorMessage = `
--- 🚨 [수동 실행] Bi-Weekly ClosedDay 배치 실패 ---
  - 성공: ${result.successCount}건
  - 실패: ${result.failureCount}건
  - 실패 상세기록:
${failLogDetails}
-------------------------------------------------`;
      this.logger.error(errorMessage);
    } else {
      const successMessage = `
--- ✅ [수동 실행] Bi-Weekly ClosedDay 배치 완료 ---
  - 성공: ${result.successCount}건
-------------------------------------------------`;
      this.logger.error(successMessage);
    }

    return result;
  }

  /**
   * 특정 장소에 14일 뒤 휴무일 생성
   */
  @Post('/:idx/bi-weekly-closed-day')
  @Exception(400, 'Invalid place idx or date')
  @Exception(404, 'Place not found')
  @Exception(409, 'Weekly closed day already exists')
  @HttpCode(200)
  @AdminAuth()
  public async createBiWeeklyClosedDay(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: CreateBiWeeklyClosedDayDto,
  ): Promise<void> {
    return this.placeService.createBiWeeklyClosedDayByPlaceIdx(idx, dto.date);
  }
}
