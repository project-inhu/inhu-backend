import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { inspect } from 'util';

/**
 * @publicApi
 */
@Injectable()
export class DiscordWebhookService {
  private readonly WEBHOOK_URL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.WEBHOOK_URL =
      this.configService.get<string>('discordWebhook.url') || '';
  }

  public async sendErrorMessage(
    title: string,
    message: string,
    error: Error,
    context: DiscordWebhookContext,
  ) {
    await this.httpService.axiosRef.post(
      this.WEBHOOK_URL,
      {
        content: `# **🚨 에러 로그 알림**`,
        embeds: [
          {
            title,
            description: `${message}
  
  Error Object
  \`\`\`
  ${this.getErrorStr(error)}
  \`\`\`
                `, // Description 추가
            color: 16711680, // 빨간색 (16진수)
            author: {
              name: context,
            },
            footer: {
              text: `시간: ${new Date().toLocaleString()}`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  private getErrorStr(err: any): string {
    if (typeof err === 'string') {
      return err;
    }

    if (typeof err === 'number') {
      return err.toString();
    }

    if (err === null || err === undefined) {
      return '';
    }

    if (err instanceof AxiosError) {
      return inspect(err.response, { depth: 1 });
    }

    return inspect(err, { depth: 2 });
  }

  public async sendWebhookMessage(message: string): Promise<void> {
    await this.httpService.axiosRef.post(
      this.WEBHOOK_URL,
      {
        content: `# 아아 마크다운 됩니까?`,
        embeds: [
          {
            description: message,
            color: 48895, // 빨간색 (16진수)
            footer: {
              text: `시간: ${new Date().toLocaleString()}`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
