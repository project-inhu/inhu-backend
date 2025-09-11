import { NestFactory } from '@nestjs/core';
import { BatchServerModule } from './batch-server.module';
import { getMode } from '@libs/common/utils/get-mode.util';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';

async function bootstrap() {
  // HTTP 서버 없이 DI 컨테이너만 생성
  const app = await NestFactory.createApplicationContext(BatchServerModule);

  if (getMode() === 'production') {
    try {
      const discordWebhookService = app.get(DiscordWebhookService);
      await discordWebhookService.sendWebhookMessage(
        `🚀 ${DiscordWebhookContext.BATCH_SERVER} 배포 알림`,
        `배치 서버가 성공적으로 시작되었습니다.`,
        DiscordWebhookContext.BATCH_SERVER,
      );
    } catch (err) {
      console.log(err);
    }
  }
}
bootstrap();
