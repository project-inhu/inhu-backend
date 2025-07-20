import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(configService: ConfigService) {
    super({
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
    });
  }

  async onModuleDestroy() {
    this.disconnect();
  }
}
