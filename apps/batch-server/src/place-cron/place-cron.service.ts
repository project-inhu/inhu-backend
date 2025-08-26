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
    private readonly discordWebhookService: DiscordWebhookService,
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

    if (result.errorList.length > 0) {
      const curl = `curl -X POST "${process.env.BATCH_SERVER_DOMAIN}/cron/weekly-closed-day/all" -H "Content-Type: application/json" -d '{ "pw": "" }'`;

      const failIds = result.errorList.map((e) => e.placeIdx).join(', ');

      await this.discordWebhookService.sendWebhookMessage(
        '🚨 Bi-Weekly ClosedDay 배치 실패',
        `성공: ${result.success}, 실패: ${result.errorList.length}\n실패 placeIdx: ${failIds}\n\n재실행:\n\`\`\`\n${curl}\n\`\`\``,
        DiscordWebhookContext.BATCH_SERVER,
      );
    }
  }
}
