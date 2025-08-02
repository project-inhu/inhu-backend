import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * RedisService는 Redis와의 연결을 관리하는 서비스입니다.
 *
 * @publicApi
 */
@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(
    configService: ConfigService,
    @Inject('REDIS_PREFIX') prefix: string,
  ) {
    super({
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      keyPrefix: prefix ? prefix + ':' : '',
    });
  }

  async onModuleDestroy() {
    this.disconnect();
  }
}
