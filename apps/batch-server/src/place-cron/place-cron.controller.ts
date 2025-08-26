import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PlaceCronService } from './place-cron.service';

@Controller('weekly-closed-day')
export class PlaceCronController {
  constructor(private readonly placeCronService: PlaceCronService) {}

  /**
   * 배치 실패 시 전체 재실행 (Discord curl에서 호출)
   *
   * @author 강정연
   */
  @Post('/cron/all')
  public async startPlaceCronAll(@Body('pw') pw: string) {
    if (!pw || pw !== 'inhu-password') {
      throw new BadRequestException('invalid password');
    }
    return this.placeCronService.AddNextBiWeeklyClosedDay();
  }
}
