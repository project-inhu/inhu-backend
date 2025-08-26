import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PlaceCronService {
  constructor(
    private readonly placeCoreService: PlaceCoreService,
    private readonly dateUtilService: DateUtilService,
    private readonly logger: Logger,
  ) {}

  /**
   * 격주 휴무일 장소에 대해 14일 뒤 다음 휴무일을 추가
   *
   * @author 강정연
   */
  public async AddNextBiWeeklyClosedDay() {
    const now = this.dateUtilService.getNow();
    const todayKSTStr = this.dateUtilService.transformKoreanDate(now);

    const result = await this.placeCoreService.createAllWeeklyClosedDay(
      new Date(todayKSTStr),
    );

    const failIds = result.errorList.map((e) => e.placeIdx).join(', ');

    const curl = `curl -X POST "${process.env.BATCH_SERVER_DOMAIN}/weekly-closed-day/cron/all" -H "Content-Type: application/json" -d '{ "pw": [관리자 비밀번호 입력 필요] }'`;

    if (result.errorList.length > 0) {
      this.logger.error(
        `🚨 Bi-Weekly ClosedDay 배치 실패\n` +
          `성공: ${result.success}, 실패: ${result.errorList.length}\n` +
          `실패 placeIdx: ${failIds}\n\n` +
          `재실행:\n${curl}`,
      );
    } else {
      this.logger.log(
        `✅ Bi-Weekly ClosedDay 배치 완료 (성공 ${result.success}건)`,
      );
    }
  }
}
