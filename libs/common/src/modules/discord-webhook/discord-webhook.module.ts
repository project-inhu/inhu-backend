import discordWebhookConfig from '@libs/common/modules/discord-webhook/config/discord-webhook.config';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/**
 * @publicApi
 */
@Module({
  imports: [ConfigModule.forFeature(discordWebhookConfig), HttpModule],
  providers: [DiscordWebhookService],
  exports: [DiscordWebhookService],
})
export class DiscordWebhookModule {}
