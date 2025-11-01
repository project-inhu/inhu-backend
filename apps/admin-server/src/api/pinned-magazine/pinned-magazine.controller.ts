import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PinnedMagazineService } from './pinned-magazine.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { PinMagazineByIdxDto } from './dto/request/pin-magazine-by-idx.dto';

@Controller()
export class PinnedMagazineController {
  constructor(private readonly pinnedMagazineService: PinnedMagazineService) {}

  /**
   * 매거진 고정/고정해제
   *
   * @author 이수인
   */
  @AdminAuth()
  @Post(':idx/pin')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found')
  @Exception(
    409,
    `- pin: true - Magazine is already pinned
     - pin: false - Magazine is not pinned`,
  )
  @HttpCode(200)
  public async pinMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: PinMagazineByIdxDto,
  ): Promise<void> {
    return await this.pinnedMagazineService.pinMagazineByIdx(idx, dto);
  }
}
