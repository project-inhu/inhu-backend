import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

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
